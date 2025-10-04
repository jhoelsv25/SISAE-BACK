-- Procedimiento para auditoría de cambios en usuarios
CREATE OR REPLACE FUNCTION audit_user_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (
            table_name,
            operation,
            old_data,
            new_data,
            user_id,
            created_at
        ) VALUES (
            TG_TABLE_NAME,
            TG_OP,
            row_to_json(OLD),
            row_to_json(NEW),
            NEW.updated_by,
            NOW()
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (
            table_name,
            operation,
            old_data,
            user_id,
            created_at
        ) VALUES (
            TG_TABLE_NAME,
            TG_OP,
            row_to_json(OLD),
            OLD.updated_by,
            NOW()
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Ejemplo de cómo crear el trigger
-- CREATE TRIGGER user_audit_trigger
-- AFTER UPDATE OR DELETE ON users
-- FOR EACH ROW
-- EXECUTE FUNCTION audit_user_changes();
