-- =============================================
-- Función para asignar y actualizar permisos a un rol
-- Recibe y retorna JSONB
-- =============================================
CREATE OR REPLACE FUNCTION assign_permissions_to_role(
  p_role_id UUID,
  p_permissions_data JSONB
)
RETURNS JSONB AS $$
DECLARE
  v_permission_ids UUID[];
  v_action VARCHAR;
  v_result JSONB := '{"success": true, "role_id": null, "action": null, "added": [], "removed": [], "errors": [], "total_permissions": 0}'::JSONB;
  v_perm_id UUID;
  v_perm_record RECORD;
  v_error_msg VARCHAR;
BEGIN
  -- Validar que el rol existe
  IF NOT EXISTS (SELECT 1 FROM roles WHERE id = p_role_id) THEN
    v_result := jsonb_set(v_result, '{success}', 'false'::JSONB);
    v_result := jsonb_set(v_result, '{errors}', jsonb_insert(v_result->'errors', '{0}', to_jsonb('El rol con ID ' || p_role_id::text || ' no existe')));
    RETURN v_result;
  END IF;

  -- Extraer datos del JSONB
  v_permission_ids := COALESCE((p_permissions_data->>'permission_ids')::text, '[]')::UUID[];
  v_action := COALESCE(p_permissions_data->>'action', 'replace');

  -- Actualizar el resultado con info del rol
  v_result := jsonb_set(v_result, '{role_id}', to_jsonb(p_role_id::text));
  v_result := jsonb_set(v_result, '{action}', to_jsonb(v_action));

  -- Validar que hay permisos para asignar
  IF array_length(v_permission_ids, 1) IS NULL OR array_length(v_permission_ids, 1) = 0 THEN
    v_result := jsonb_set(v_result, '{errors}', jsonb_insert(v_result->'errors', '{0}', to_jsonb('No se proporcionó ningún ID de permiso')));
    RETURN v_result;
  END IF;

  BEGIN
    -- Si la acción es 'replace', guardar los permisos a eliminar y luego eliminarlos
    IF v_action = 'replace' THEN
      FOR v_perm_record IN
        SELECT rp.permission_id, p.name, p.key
        FROM role_permissions rp
        JOIN permissions p ON rp.permission_id = p.id
        WHERE rp.role_id = p_role_id
          AND rp.permission_id NOT IN (SELECT unnest(v_permission_ids))
      LOOP
        v_result := jsonb_set(v_result, '{removed}', jsonb_insert(
          v_result->'removed',
          '{' || jsonb_array_length(v_result->'removed') || '}',
          jsonb_build_object(
            'id', v_perm_record.permission_id::text,
            'name', v_perm_record.name,
            'key', v_perm_record.key
          )
        ));
      END LOOP;

      DELETE FROM role_permissions 
      WHERE role_id = p_role_id;
    END IF;

    -- Insertar los nuevos permisos
    FOR v_perm_id IN SELECT unnest(v_permission_ids)
    LOOP
      -- Validar que el permiso existe
      IF NOT EXISTS (SELECT 1 FROM permissions WHERE id = v_perm_id) THEN
        v_result := jsonb_set(v_result, '{errors}', jsonb_insert(
          v_result->'errors',
          '{' || jsonb_array_length(v_result->'errors') || '}',
          to_jsonb('El permiso con ID ' || v_perm_id::text || ' no existe')
        ));
        CONTINUE;
      END IF;

      -- Verificar si ya existe la relación
      IF NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = p_role_id AND permission_id = v_perm_id) THEN
        INSERT INTO role_permissions (id, role_id, permission_id, created_at, updated_at)
        VALUES (gen_random_uuid(), p_role_id, v_perm_id, NOW(), NOW())
        ON CONFLICT DO NOTHING;

        -- Agregar a la lista de permisos añadidos
        SELECT id, name, key INTO v_perm_record FROM permissions WHERE id = v_perm_id;
        v_result := jsonb_set(v_result, '{added}', jsonb_insert(
          v_result->'added',
          '{' || jsonb_array_length(v_result->'added') || '}',
          jsonb_build_object(
            'id', v_perm_id::text,
            'name', v_perm_record.name,
            'key', v_perm_record.key
          )
        ));
      END IF;
    END LOOP;

    -- Obtener el total de permisos del rol
    SELECT COUNT(*) INTO v_result->'total_permissions'
    FROM role_permissions
    WHERE role_id = p_role_id;

    -- Obtener los datos completos del rol con todos sus permisos
    v_result := jsonb_set(v_result, '{role}', (
      SELECT jsonb_build_object(
        'id', r.id::text,
        'name', r.name,
        'description', r.description,
        'is_system', r.is_system,
        'is_active', r.is_active,
        'permissions', COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'id', p.id::text,
              'name', p.name,
              'key', p.key,
              'module_id', p.module_id::text
            )
          ), '[]'::JSONB
        )
      )
      FROM roles r
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      LEFT JOIN permissions p ON rp.permission_id = p.id
      WHERE r.id = p_role_id
      GROUP BY r.id, r.name, r.description, r.is_system, r.is_active
    ));

  EXCEPTION WHEN OTHERS THEN
    v_result := jsonb_set(v_result, '{success}', 'false'::JSONB);
    v_result := jsonb_set(v_result, '{errors}', jsonb_insert(
      v_result->'errors',
      '{' || jsonb_array_length(v_result->'errors') || '}',
      to_jsonb('Error al procesar los permisos: ' || SQLERRM)
    ));
  END;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- Función para eliminar permisos específicos de un rol
-- Recibe y retorna JSONB
-- =============================================
CREATE OR REPLACE FUNCTION remove_permissions_from_role(
  p_role_id UUID,
  p_permissions_data JSONB
)
RETURNS JSONB AS $$
DECLARE
  v_permission_ids UUID[];
  v_result JSONB := '{"success": true, "role_id": null, "removed": [], "errors": [], "total_permissions": 0}'::JSONB;
  v_perm_id UUID;
  v_perm_record RECORD;
BEGIN
  -- Validar que el rol existe
  IF NOT EXISTS (SELECT 1 FROM roles WHERE id = p_role_id) THEN
    v_result := jsonb_set(v_result, '{success}', 'false'::JSONB);
    v_result := jsonb_set(v_result, '{errors}', jsonb_insert(v_result->'errors', '{0}', to_jsonb('El rol con ID ' || p_role_id::text || ' no existe')));
    RETURN v_result;
  END IF;

  -- Extraer IDs de permisos del JSONB
  v_permission_ids := COALESCE((p_permissions_data->>'permission_ids')::text, '[]')::UUID[];

  v_result := jsonb_set(v_result, '{role_id}', to_jsonb(p_role_id::text));

  -- Validar que hay permisos para eliminar
  IF array_length(v_permission_ids, 1) IS NULL OR array_length(v_permission_ids, 1) = 0 THEN
    v_result := jsonb_set(v_result, '{errors}', jsonb_insert(v_result->'errors', '{0}', to_jsonb('No se proporcionó ningún ID de permiso para eliminar')));
    RETURN v_result;
  END IF;

  BEGIN
    -- Obtener info de los permisos a eliminar antes de borrarlos
    FOR v_perm_record IN
      SELECT p.id, p.name, p.key
      FROM role_permissions rp
      JOIN permissions p ON rp.permission_id = p.id
      WHERE rp.role_id = p_role_id
        AND rp.permission_id = ANY(v_permission_ids)
    LOOP
      v_result := jsonb_set(v_result, '{removed}', jsonb_insert(
        v_result->'removed',
        '{' || jsonb_array_length(v_result->'removed') || '}',
        jsonb_build_object(
          'id', v_perm_record.id::text,
          'name', v_perm_record.name,
          'key', v_perm_record.key
        )
      ));
    END LOOP;

    -- Eliminar los permisos
    DELETE FROM role_permissions
    WHERE role_id = p_role_id 
      AND permission_id = ANY(v_permission_ids);

    -- Obtener el total de permisos restantes
    SELECT COUNT(*) INTO v_result->'total_permissions'
    FROM role_permissions
    WHERE role_id = p_role_id;

    -- Obtener los datos completos del rol con los permisos restantes
    v_result := jsonb_set(v_result, '{role}', (
      SELECT jsonb_build_object(
        'id', r.id::text,
        'name', r.name,
        'description', r.description,
        'is_system', r.is_system,
        'is_active', r.is_active,
        'permissions', COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'id', p.id::text,
              'name', p.name,
              'key', p.key,
              'module_id', p.module_id::text
            )
          ), '[]'::JSONB
        )
      )
      FROM roles r
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      LEFT JOIN permissions p ON rp.permission_id = p.id
      WHERE r.id = p_role_id
      GROUP BY r.id, r.name, r.description, r.is_system, r.is_active
    ));

  EXCEPTION WHEN OTHERS THEN
    v_result := jsonb_set(v_result, '{success}', 'false'::JSONB);
    v_result := jsonb_set(v_result, '{errors}', jsonb_insert(
      v_result->'errors',
      '{' || jsonb_array_length(v_result->'errors') || '}',
      to_jsonb('Error al eliminar los permisos: ' || SQLERRM)
    ));
  END;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- Función para sincronizar permisos de un rol
-- Recibe y retorna JSONB
-- =============================================
CREATE OR REPLACE FUNCTION sync_role_permissions(
  p_role_id UUID,
  p_permissions_data JSONB
)
RETURNS JSONB AS $$
DECLARE
  v_permission_ids UUID[];
  v_result JSONB := '{"success": true, "role_id": null, "added": [], "removed": [], "errors": [], "total_permissions": 0}'::JSONB;
  v_perm_id UUID;
  v_perm_record RECORD;
BEGIN
  -- Validar que el rol existe
  IF NOT EXISTS (SELECT 1 FROM roles WHERE id = p_role_id) THEN
    v_result := jsonb_set(v_result, '{success}', 'false'::JSONB);
    v_result := jsonb_set(v_result, '{errors}', jsonb_insert(v_result->'errors', '{0}', to_jsonb('El rol con ID ' || p_role_id::text || ' no existe')));
    RETURN v_result;
  END IF;

  -- Extraer IDs de permisos del JSONB
  v_permission_ids := COALESCE((p_permissions_data->>'permission_ids')::text, '[]')::UUID[];

  v_result := jsonb_set(v_result, '{role_id}', to_jsonb(p_role_id::text));

  BEGIN
    -- Obtener permisos a eliminar (los que no están en el nuevo array)
    FOR v_perm_record IN
      SELECT p.id, p.name, p.key
      FROM role_permissions rp
      JOIN permissions p ON rp.permission_id = p.id
      WHERE rp.role_id = p_role_id
        AND rp.permission_id NOT IN (SELECT unnest(v_permission_ids))
    LOOP
      v_result := jsonb_set(v_result, '{removed}', jsonb_insert(
        v_result->'removed',
        '{' || jsonb_array_length(v_result->'removed') || '}',
        jsonb_build_object(
          'id', v_perm_record.id::text,
          'name', v_perm_record.name,
          'key', v_perm_record.key
        )
      ));
    END LOOP;

    -- Eliminar permisos que no están en el nuevo array
    DELETE FROM role_permissions
    WHERE role_id = p_role_id
      AND permission_id NOT IN (SELECT unnest(v_permission_ids));

    -- Insertar nuevos permisos
    FOR v_perm_id IN SELECT unnest(v_permission_ids)
    LOOP
      -- Validar que el permiso existe
      IF NOT EXISTS (SELECT 1 FROM permissions WHERE id = v_perm_id) THEN
        v_result := jsonb_set(v_result, '{errors}', jsonb_insert(
          v_result->'errors',
          '{' || jsonb_array_length(v_result->'errors') || '}',
          to_jsonb('El permiso con ID ' || v_perm_id::text || ' no existe')
        ));
        CONTINUE;
      END IF;

      -- Insertar si no existe
      IF NOT EXISTS (SELECT 1 FROM role_permissions WHERE role_id = p_role_id AND permission_id = v_perm_id) THEN
        INSERT INTO role_permissions (id, role_id, permission_id, created_at, updated_at)
        VALUES (gen_random_uuid(), p_role_id, v_perm_id, NOW(), NOW())
        ON CONFLICT DO NOTHING;

        SELECT id, name, key INTO v_perm_record FROM permissions WHERE id = v_perm_id;
        v_result := jsonb_set(v_result, '{added}', jsonb_insert(
          v_result->'added',
          '{' || jsonb_array_length(v_result->'added') || '}',
          jsonb_build_object(
            'id', v_perm_id::text,
            'name', v_perm_record.name,
            'key', v_perm_record.key
          )
        ));
      END IF;
    END LOOP;

    -- Obtener el total de permisos del rol
    SELECT COUNT(*) INTO v_result->'total_permissions'
    FROM role_permissions
    WHERE role_id = p_role_id;

    -- Obtener los datos completos del rol con todos sus permisos
    v_result := jsonb_set(v_result, '{role}', (
      SELECT jsonb_build_object(
        'id', r.id::text,
        'name', r.name,
        'description', r.description,
        'is_system', r.is_system,
        'is_active', r.is_active,
        'permissions', COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'id', p.id::text,
              'name', p.name,
              'key', p.key,
              'module_id', p.module_id::text
            )
          ), '[]'::JSONB
        )
      )
      FROM roles r
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      LEFT JOIN permissions p ON rp.permission_id = p.id
      WHERE r.id = p_role_id
      GROUP BY r.id, r.name, r.description, r.is_system, r.is_active
    ));

  EXCEPTION WHEN OTHERS THEN
    v_result := jsonb_set(v_result, '{success}', 'false'::JSONB);
    v_result := jsonb_set(v_result, '{errors}', jsonb_insert(
      v_result->'errors',
      '{' || jsonb_array_length(v_result->'errors') || '}',
      to_jsonb('Error al sincronizar los permisos: ' || SQLERRM)
    ));
  END;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;
