-- =============================================
-- Función para registrar asistencia de forma masiva
-- Recibe JSONB con los datos de asistencia
-- =============================================
CREATE OR REPLACE FUNCTION register_bulk_attendance(
  p_data JSONB
)
RETURNS JSONB AS $$
DECLARE
  v_section_course_id UUID;
  v_date DATE;
  v_session_type VARCHAR;
  v_attendances JSONB;
  v_item JSONB;
  v_enrollment_id UUID;
  v_status VARCHAR;
  v_observations TEXT;
  v_check_in_time TIME;
  v_check_out_time TIME;
  v_result JSONB := '{"success": true, "message": "Asistencias registradas correctamente", "processed": 0, "errors": []}'::JSONB;
  v_processed_count INTEGER := 0;
BEGIN
  -- Extraer datos generales
  v_section_course_id := (p_data->>'sectionCourseId')::UUID;
  v_date := (p_data->>'date')::DATE;
  v_session_type := COALESCE(p_data->>'sessionType', 'lecture');
  v_attendances := p_data->'attendances';

  -- Validar que existan datos básicos
  IF v_section_course_id IS NULL OR v_date IS NULL OR v_attendances IS NULL OR jsonb_array_length(v_attendances) = 0 THEN
    RETURN jsonb_build_object('success', false, 'message', 'Datos incompletos o inválidos');
  END IF;

  -- Asegurar que existe el constraint único (esto es mejor hacerlo fuera, pero por seguridad)
  -- En una función real, no haríamos ALTER TABLE cada vez, solo confiamos en que existe.
  
  -- Procesar cada registro de asistencia
  FOR v_item IN SELECT * FROM jsonb_array_elements(v_attendances)
  LOOP
    v_enrollment_id := (v_item->>'enrollmentId')::UUID;
    v_status := v_item->>'status';
    v_observations := v_item->>'observations';
    v_check_in_time := (v_item->>'checkInTime')::TIME;
    v_check_out_time := (v_item->>'checkOutTime')::TIME;

    -- Upsert de asistencia (usando nombres de columnas snake_case según SnakeNamingStrategy)
    INSERT INTO attendances (
      id, 
      date, 
      session_type, 
      status, 
      check_in_time, 
      check_out_time, 
      observations, 
      enrollment_id, 
      section_course_id,
      created_at,
      updated_at
    )
    VALUES (
      gen_random_uuid(),
      v_date,
      v_session_type::"attendances_session_type_enum",
      v_status::"attendances_status_enum",
      COALESCE(v_check_in_time, '00:00:00'::TIME),
      v_check_out_time,
      v_observations,
      v_enrollment_id,
      v_section_course_id,
      NOW(),
      NOW()
    )
    ON CONFLICT (date, enrollment_id, section_course_id) DO UPDATE SET
      status = EXCLUDED.status,
      observations = EXCLUDED.observations,
      check_in_time = EXCLUDED.check_in_time,
      check_out_time = EXCLUDED.check_out_time,
      updated_at = NOW();

    v_processed_count := v_processed_count + 1;
  END LOOP;

  v_result := jsonb_set(v_result, '{processed}', to_jsonb(v_processed_count));
  RETURN v_result;

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false, 
    'message', 'Error al procesar asistencias: ' || SQLERRM,
    'processed', v_processed_count
  );
END;
$$ LANGUAGE plpgsql;
