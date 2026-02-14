-- =============================================
-- Función para registrar notas de evaluación de forma masiva
-- Recibe JSONB con los datos de las notas
-- =============================================
CREATE OR REPLACE FUNCTION register_bulk_assessment_scores(
  p_data JSONB
)
RETURNS JSONB AS $$
DECLARE
  v_assessment_id UUID;
  v_scores JSONB;
  v_item JSONB;
  v_enrollment_id UUID;
  v_score NUMERIC(5,2);
  v_observation TEXT;
  v_result JSONB := '{"success": true, "message": "Notas registradas correctamente", "processed": 0, "errors": []}'::JSONB;
  v_processed_count INTEGER := 0;
BEGIN
  -- Extraer datos generales
  v_assessment_id := (p_data->>'assessmentId')::UUID;
  v_scores := p_data->'scores';

  -- Validar que existan datos básicos
  IF v_assessment_id IS NULL OR v_scores IS NULL OR jsonb_array_length(v_scores) = 0 THEN
    RETURN jsonb_build_object('success', false, 'message', 'Datos incompletos o inválidos');
  END IF;

  -- Procesar cada registro de nota
  FOR v_item IN SELECT * FROM jsonb_array_elements(v_scores)
  LOOP
    v_enrollment_id := (v_item->>'enrollmentId')::UUID;
    v_score := (v_item->>'score')::NUMERIC(5,2);
    v_observation := v_item->>'observation';

    -- Upsert de nota
    INSERT INTO assessment_scores (
      id, 
      score, 
      observation, 
      register_at, 
      enrollment_id, 
      assessment_id,
      created_at,
      updated_at
    )
    VALUES (
      gen_random_uuid(),
      v_score,
      COALESCE(v_observation, ''),
      NOW(),
      v_enrollment_id,
      v_assessment_id,
      NOW(),
      NOW()
    )
    ON CONFLICT (enrollment_id, assessment_id) DO UPDATE SET
      score = EXCLUDED.score,
      observation = EXCLUDED.observation,
      updated_at = NOW();

    v_processed_count := v_processed_count + 1;
  END LOOP;

  v_result := jsonb_set(v_result, '{processed}', to_jsonb(v_processed_count));
  RETURN v_result;

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false, 
    'message', 'Error al procesar notas: ' || SQLERRM,
    'processed', v_processed_count
  );
END;
$$ LANGUAGE plpgsql;
