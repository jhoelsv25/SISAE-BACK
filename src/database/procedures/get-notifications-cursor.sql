-- Procedimiento para obtener notificaciones con paginación por cursor
CREATE OR REPLACE FUNCTION get_notifications_cursor(p_params JSONB)
RETURNS JSONB AS $$
DECLARE
    v_limit INT := COALESCE((p_params->>'limit')::INT, 20);
    v_cursor_date TIMESTAMPTZ := (p_params->>'cursorDate')::TIMESTAMPTZ;
    v_cursor_id UUID := (p_params->>'cursorId')::UUID;
    v_recipient_id UUID := (p_params->>'recipientId')::UUID;
    v_is_read BOOLEAN := (p_params->>'isRead')::BOOLEAN;
    v_result JSONB;
BEGIN
    -- Obtenemos las notificaciones y las agrupamos en un array JSONB
    WITH filtered_notifications AS (
        SELECT 
            n.id,
            n.title,
            n.content,
            n.is_read as "isRead",
            n.link_url as "linkUrl",
            n.send_at as "sendAt",
            n.read_at as "readAt",
            n.type,
            n.priority,
            n.recipient_id as "recipientId",
            n.created_at as "createdAt"
        FROM notifications n
        WHERE 
            n.recipient_id = v_recipient_id
            AND (v_is_read IS NULL OR n.is_read = v_is_read)
            AND (
                v_cursor_date IS NULL OR v_cursor_id IS NULL
                OR n.created_at < v_cursor_date
                OR (n.created_at = v_cursor_date AND n.id < v_cursor_id)
            )
        ORDER BY n.created_at DESC, n.id DESC
        LIMIT v_limit
    ),
    notifications_array AS (
        SELECT jsonb_agg(fn) as data FROM filtered_notifications fn
    ),
    last_item AS (
        SELECT "createdAt", id FROM filtered_notifications ORDER BY "createdAt" ASC, id ASC LIMIT 1
    )
    SELECT 
        jsonb_build_object(
            'data', COALESCE(na.data, '[]'::jsonb),
            'nextCursor', CASE 
                WHEN (SELECT COUNT(*) FROM filtered_notifications) = v_limit THEN 
                    (SELECT jsonb_build_object('date', li."createdAt", 'id', li.id) FROM last_item li)
                ELSE NULL 
            END,
            'unreadCount', (SELECT COUNT(*) FROM notifications WHERE recipient_id = v_recipient_id AND is_read = false)
        )
    INTO v_result
    FROM notifications_array na;

    RETURN v_result;
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'data', '[]'::jsonb,
        'nextCursor', NULL,
        'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql;
