-- Procedimiento para obtener usuarios con paginación por cursor, entrada y salida en JSONB
CREATE OR REPLACE FUNCTION get_users_cursor(p_params JSONB)
RETURNS JSONB AS $$
DECLARE
    v_limit INT := COALESCE((p_params->>'limit')::INT, 10);
    v_cursor_date TIMESTAMPTZ := (p_params->>'cursorDate')::TIMESTAMPTZ;
    v_cursor_id UUID := (p_params->>'cursorId')::UUID;
    v_search TEXT := p_params->>'search';
    v_role_id UUID := (p_params->>'roleId')::UUID;
    v_role_name TEXT := p_params->>'roleName';
    v_created_from TIMESTAMPTZ := CASE WHEN COALESCE(p_params->>'createdFrom', '') = '' THEN NULL ELSE (p_params->>'createdFrom')::TIMESTAMPTZ END;
    v_created_to TIMESTAMPTZ := CASE WHEN COALESCE(p_params->>'createdTo', '') = '' THEN NULL ELSE (p_params->>'createdTo')::TIMESTAMPTZ END;
    v_result JSONB;
BEGIN
    WITH filtered_users AS (
        SELECT 
            u.id,
            u.username,
            u.email,
            u.is_active as "isActive",
            u.last_login as "lastLogin",
            u.status,
            u.created_at as "createdAt",
            p.first_name as "firstName",
            p.last_name as "lastName",
            p.photo_url as "avatarUrl",
            r.name as "roleName",
            r.id as "roleId"
        FROM users u
        LEFT JOIN persons p ON u.person_id = p.id
        LEFT JOIN roles r ON u.role_id = r.id
        WHERE 
            (v_role_id IS NULL OR r.id = v_role_id)
            AND (v_role_name IS NULL OR LOWER(r.name) = LOWER(v_role_name))
            AND (
                v_search IS NULL 
                OR u.username ILIKE '%' || v_search || '%'
                OR u.email ILIKE '%' || v_search || '%'
                OR p.first_name ILIKE '%' || v_search || '%'
                OR p.last_name ILIKE '%' || v_search || '%'
            )
            AND (v_created_from IS NULL OR u.created_at >= v_created_from)
            AND (v_created_to IS NULL OR u.created_at < (v_created_to + INTERVAL '1 day'))
            AND (
                v_cursor_date IS NULL OR v_cursor_id IS NULL
                OR u.created_at < v_cursor_date
                OR (u.created_at = v_cursor_date AND u.id < v_cursor_id)
            )
        ORDER BY u.created_at DESC, u.id DESC
        LIMIT v_limit
    ),
    users_array AS (
        SELECT COALESCE(jsonb_agg(
            jsonb_build_object(
                'id', fu.id,
                'username', fu.username,
                'email', fu.email,
                'isActive', fu."isActive",
                'lastLogin', fu."lastLogin",
                'status', fu.status,
                'createdAt', fu."createdAt",
                'firstName', fu."firstName",
                'lastName', fu."lastName",
                'avatarUrl', fu."avatarUrl",
                'roleName', fu."roleName",
                'roleId', fu."roleId"
            )
        ), '[]'::jsonb) as data FROM filtered_users fu
    ),
    last_item AS (
        SELECT "createdAt", id FROM filtered_users ORDER BY "createdAt" ASC, id ASC LIMIT 1
    )
    SELECT 
        jsonb_build_object(
            'data', ua.data,
            'nextCursor', CASE 
                WHEN (SELECT COUNT(*) FROM filtered_users) = v_limit THEN 
                    (SELECT jsonb_build_object('date', li."createdAt", 'id', li.id) FROM last_item li)
                ELSE NULL 
            END
        )
    INTO v_result
    FROM users_array ua;

    RETURN v_result;
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'data', '[]'::jsonb,
        'nextCursor', NULL,
        'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql;
