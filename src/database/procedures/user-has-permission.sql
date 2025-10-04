-- Función para verificar si un usuario tiene un permiso específico
CREATE OR REPLACE FUNCTION user_has_permission(
    user_id_param UUID,
    module_name_param VARCHAR,
    action_name_param VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
    has_permission BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM users u
        INNER JOIN user_roles ur ON u.id = ur.user_id
        INNER JOIN roles r ON ur.role_id = r.id
        INNER JOIN role_permissions rp ON r.id = rp.role_id
        INNER JOIN permissions p ON rp.permission_id = p.id
        INNER JOIN modules m ON p.module_id = m.id
        INNER JOIN permission_actions pa ON p.id = pa.permission_id
        INNER JOIN actions a ON pa.action_id = a.id
        WHERE u.id = user_id_param
        AND m.name = module_name_param
        AND a.name = action_name_param
        AND u.is_active = true
        AND r.is_active = true
    ) INTO has_permission;
    
    RETURN has_permission;
END;
$$ LANGUAGE plpgsql;
