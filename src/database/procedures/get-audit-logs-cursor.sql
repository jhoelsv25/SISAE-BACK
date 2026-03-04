-- Procedimiento para obtener logs con paginación por cursor, entrada y salida en JSONB, incluyendo búsqueda
CREATE OR REPLACE FUNCTION get_audit_logs_cursor(p_params JSONB)
RETURNS JSONB AS $$
DECLARE
    v_limit INT := COALESCE((p_params->>'limit')::INT, 50);
    v_cursor_date TIMESTAMPTZ := (p_params->>'cursorDate')::TIMESTAMPTZ;
    v_cursor_id UUID := (p_params->>'cursorId')::UUID;
    v_entity VARCHAR := p_params->>'entity';
    v_action VARCHAR := p_params->>'action';
    v_search TEXT := p_params->>'search';
    v_result JSONB;
BEGIN
    -- Obtenemos los logs y los agrupamos en un array JSONB
    WITH filtered_logs AS (
        SELECT 
            al.id,
            CASE 
                WHEN al.user_id IS NOT NULL THEN 
                    jsonb_build_object(
                        'id', al.user_id,
                        'name', COALESCE(p.first_name || ' ' || p.last_name, u.username, 'Usuario desconocido'),
                        'avatar', p.photo_url
                    )
                ELSE 
                    jsonb_build_object('id', null, 'name', 'Sistema', 'avatar', null)
            END as "user",
            al.entity,
            al.entity_id as "entityId",
            al.before::jsonb as before,
            al.after::jsonb as after,
            al.action,
            al.description,
            al.created_at as "createdAt",
            al.updated_at as "updatedAt"
        FROM audit_logs al
        LEFT JOIN users u ON al.user_id = u.id
        LEFT JOIN persons p ON u.person_id = p.id
        WHERE 
            (v_entity IS NULL OR al.entity ILIKE '%' || v_entity || '%')
            AND (v_action IS NULL OR al.action = UPPER(v_action))
            AND (
                v_search IS NULL 
                OR al.entity ILIKE '%' || v_search || '%'
                OR al.description ILIKE '%' || v_search || '%'
                OR COALESCE(p.first_name, '') ILIKE '%' || v_search || '%'
                OR COALESCE(p.last_name, '') ILIKE '%' || v_search || '%'
                OR COALESCE(u.username, '') ILIKE '%' || v_search || '%'
            )
            AND (
                v_cursor_date IS NULL OR v_cursor_id IS NULL
                OR al.created_at < v_cursor_date
                OR (al.created_at = v_cursor_date AND al.id < v_cursor_id)
            )
        ORDER BY al.created_at DESC, al.id DESC
        LIMIT v_limit
    ),
    logs_array AS (
        SELECT jsonb_agg(fl) as data FROM filtered_logs fl
    ),
    last_item AS (
        SELECT "createdAt", id FROM filtered_logs ORDER BY "createdAt" ASC, id ASC LIMIT 1
    )
    SELECT 
        jsonb_build_object(
            'data', COALESCE(la.data, '[]'::jsonb),
            'nextCursor', CASE 
                WHEN (SELECT COUNT(*) FROM filtered_logs) = v_limit THEN 
                    (SELECT jsonb_build_object('date', li."createdAt", 'id', li.id) FROM last_item li)
                ELSE NULL 
            END
        )
    INTO v_result
    FROM logs_array la;

    RETURN v_result;
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'data', '[]'::jsonb,
        'nextCursor', NULL,
        'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql;
