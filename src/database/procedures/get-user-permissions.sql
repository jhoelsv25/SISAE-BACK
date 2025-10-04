-- Procedimiento para obtener permisos de un usuario
CREATE OR REPLACE FUNCTION get_user_permissions(user_id_param UUID)
RETURNS TABLE (
    permission_name VARCHAR,
    module_name VARCHAR,
    action_name VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        p.name as permission_name,
        m.name as module_name,
        a.name as action_name
    FROM users u
    INNER JOIN user_roles ur ON u.id = ur.user_id
    INNER JOIN roles r ON ur.role_id = r.id
    INNER JOIN role_permissions rp ON r.id = rp.role_id
    INNER JOIN permissions p ON rp.permission_id = p.id
    INNER JOIN modules m ON p.module_id = m.id
    INNER JOIN permission_actions pa ON p.id = pa.permission_id
    INNER JOIN actions a ON pa.action_id = a.id
    WHERE u.id = user_id_param
    AND u.is_active = true
    AND r.is_active = true;
END;
$$ LANGUAGE plpgsql;
