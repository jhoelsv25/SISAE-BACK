CREATE OR REPLACE FUNCTION get_global_search(p_params JSONB)
RETURNS JSONB AS $$
DECLARE
    v_limit INT := LEAST(GREATEST(COALESCE((p_params->>'limit')::INT, 10), 1), 25);
    v_search TEXT := NULLIF(TRIM(COALESCE(p_params->>'search', '')), '');
    v_user_id UUID := CASE
        WHEN COALESCE(p_params->>'userId', '') = '' THEN NULL
        ELSE (p_params->>'userId')::UUID
    END;
    v_role_name TEXT := LOWER(COALESCE(p_params->>'roleName', ''));
    v_result JSONB;
BEGIN
    WITH actor AS (
        SELECT
            v_user_id AS user_id,
            v_role_name AS role_name,
            CASE WHEN v_role_name LIKE '%admin%' OR v_role_name LIKE '%director%' OR v_role_name LIKE '%subdirector%' OR v_role_name LIKE '%ugel%' THEN TRUE ELSE FALSE END AS is_admin,
            CASE WHEN v_role_name LIKE '%docente%' OR v_role_name LIKE '%teacher%' THEN TRUE ELSE FALSE END AS is_teacher,
            CASE WHEN v_role_name LIKE '%student%' OR v_role_name LIKE '%alumno%' OR v_role_name LIKE '%estudiante%' THEN TRUE ELSE FALSE END AS is_student,
            CASE WHEN v_role_name LIKE '%guardian%' OR v_role_name LIKE '%apoderado%' OR v_role_name LIKE '%tutor%' THEN TRUE ELSE FALSE END AS is_guardian
    ),
    actor_entities AS (
        SELECT
            a.*,
            (SELECT t.id FROM users u INNER JOIN teachers t ON t.person_id = u.person_id WHERE u.id = a.user_id LIMIT 1) AS teacher_id,
            (SELECT s.id FROM users u INNER JOIN students s ON s.person_id = u.person_id WHERE u.id = a.user_id LIMIT 1) AS student_id,
            (SELECT g.id FROM users u INNER JOIN guardians g ON g.person_id = u.person_id WHERE u.id = a.user_id LIMIT 1) AS guardian_id
        FROM actor a
    ),
    accessible_section_courses AS (
        SELECT DISTINCT sc.id, sc."courseId" AS course_id, sc."sectionId" AS section_id
        FROM section_courses sc
        CROSS JOIN actor_entities ae
        WHERE
            ae.is_admin
            OR (ae.is_teacher AND sc."teacherId" = ae.teacher_id)
            OR (
                ae.is_student
                AND EXISTS (
                    SELECT 1
                    FROM enrollments e
                    WHERE e.student_id = ae.student_id
                      AND e.section_id = sc."sectionId"
                      AND e.academic_year_id = sc.academic_year_id
                      AND e.status::text = 'enrolled'
                )
            )
            OR (
                ae.is_guardian
                AND EXISTS (
                    SELECT 1
                    FROM student_guardians sg
                    INNER JOIN enrollments e ON e.student_id = sg.student_id
                    WHERE sg.guardian_id = ae.guardian_id
                      AND e.section_id = sc."sectionId"
                      AND e.academic_year_id = sc.academic_year_id
                      AND e.status::text = 'enrolled'
                )
            )
    ),
    search_results AS (
        SELECT *
        FROM (
            SELECT
                'course'::TEXT AS type,
                c.id,
                c.name AS title,
                CONCAT('Curso · ', COALESCE(c.code, 'SIN-COD')) AS subtitle,
                '/organization/section-courses?courseId=' || c.id AS route,
                CONCAT_WS(' ', c.name, c.code, c.description) AS keywords,
                c.updated_at AS sort_date
            FROM courses c
            WHERE EXISTS (SELECT 1 FROM accessible_section_courses ascx WHERE ascx.course_id = c.id)

            UNION ALL

            SELECT
                'section_course'::TEXT AS type,
                sc.id,
                CONCAT(c.name, ' · Sección ', s.name) AS title,
                'Curso asignado' AS subtitle,
                '/organization/section-courses?courseId=' || c.id || '&sectionId=' || s.id AS route,
                CONCAT_WS(' ', c.name, s.name) AS keywords,
                sc.updated_at AS sort_date
            FROM section_courses sc
            INNER JOIN accessible_section_courses ascx ON ascx.id = sc.id
            INNER JOIN courses c ON c.id = sc."courseId"
            INNER JOIN sections s ON s.id = sc."sectionId"

            UNION ALL

            SELECT
                'virtual_classroom'::TEXT AS type,
                vc.id,
                CONCAT(c.name, ' · Aula virtual') AS title,
                CONCAT('Sección ', s.name) AS subtitle,
                '/virtual-classroom/' || vc.id || '/timeline' AS route,
                CONCAT_WS(' ', c.name, s.name, vc.platform::text, vc.type::text) AS keywords,
                vc.updated_at AS sort_date
            FROM virtual_classrooms vc
            INNER JOIN accessible_section_courses ascx ON ascx.id = vc.section_course_id
            INNER JOIN courses c ON c.id = ascx.course_id
            INNER JOIN sections s ON s.id = ascx.section_id

            UNION ALL

            SELECT
                'assessment'::TEXT AS type,
                a.id,
                a.name AS title,
                CONCAT(COALESCE(c.name, 'Evaluación'), ' · ', COALESCE(ap.name, 'Sin período')) AS subtitle,
                '/assessments/list' AS route,
                CONCAT_WS(' ', a.name, a.description, c.name, ap.name) AS keywords,
                a.updated_at AS sort_date
            FROM assessments a
            INNER JOIN accessible_section_courses ascx ON ascx.id = a.section_course_id
            LEFT JOIN courses c ON c.id = ascx.course_id
            LEFT JOIN academic_periods ap ON ap.id = a.period_id

            UNION ALL

            SELECT
                'student'::TEXT AS type,
                st.id,
                CONCAT(COALESCE(pp.first_name, ''), ' ', COALESCE(pp.last_name, '')) AS title,
                CONCAT('Estudiante · ', st.student_code) AS subtitle,
                '/students/' || st.id AS route,
                CONCAT_WS(' ', pp.first_name, pp.last_name, st.student_code, pp.document_number) AS keywords,
                st.updated_at AS sort_date
            FROM students st
            INNER JOIN persons pp ON pp.id = st.person_id
            CROSS JOIN actor_entities ae
            WHERE
                ae.is_admin
                OR (
                    ae.is_teacher
                    AND EXISTS (
                        SELECT 1
                        FROM accessible_section_courses ascx
                        INNER JOIN section_courses scx ON scx.id = ascx.id
                        INNER JOIN enrollments e ON e.section_id = scx."sectionId" AND e.academic_year_id = scx.academic_year_id
                        WHERE e.student_id = st.id
                          AND e.status::text = 'enrolled'
                    )
                )
                OR (ae.is_student AND st.id = ae.student_id)
                OR (
                    ae.is_guardian
                    AND EXISTS (
                        SELECT 1 FROM student_guardians sg
                        WHERE sg.guardian_id = ae.guardian_id
                          AND sg.student_id = st.id
                    )
                )

            UNION ALL

            SELECT
                'teacher'::TEXT AS type,
                t.id,
                CONCAT(COALESCE(pp.first_name, ''), ' ', COALESCE(pp.last_name, '')) AS title,
                CONCAT('Docente · ', t.teacher_code) AS subtitle,
                '/teachers/' || t.id AS route,
                CONCAT_WS(' ', pp.first_name, pp.last_name, t.teacher_code, t.specialization) AS keywords,
                t.updated_at AS sort_date
            FROM teachers t
            INNER JOIN persons pp ON pp.id = t.person_id
            CROSS JOIN actor_entities ae
            WHERE ae.is_admin OR (ae.is_teacher AND t.id = ae.teacher_id)

            UNION ALL

            SELECT
                'payment'::TEXT AS type,
                pay.id,
                pay.concept AS title,
                CONCAT('Pago · ', COALESCE(st.student_code, en.code, 'SIN-COD')) AS subtitle,
                '/payments/' || pay.id AS route,
                CONCAT_WS(' ', pay.concept, pay.receipt_number, pay.payer_name, st.student_code) AS keywords,
                pay.updated_at AS sort_date
            FROM payments pay
            INNER JOIN enrollments en ON en.id = pay.enrollment_id_id
            INNER JOIN students st ON st.id = en.student_id
            CROSS JOIN actor_entities ae
            WHERE
                ae.is_admin
                OR (ae.is_student AND st.id = ae.student_id)
                OR (
                    ae.is_guardian
                    AND EXISTS (
                        SELECT 1 FROM student_guardians sg
                        WHERE sg.guardian_id = ae.guardian_id
                          AND sg.student_id = st.id
                    )
                )
        ) entries
        WHERE
            v_search IS NULL
            OR entries.title ILIKE '%' || v_search || '%'
            OR entries.subtitle ILIKE '%' || v_search || '%'
            OR entries.keywords ILIKE '%' || v_search || '%'
        ORDER BY entries.sort_date DESC, entries.title ASC
        LIMIT v_limit
    )
    SELECT jsonb_build_object(
        'data',
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'id', sr.id,
                    'type', sr.type,
                    'title', sr.title,
                    'subtitle', sr.subtitle,
                    'route', sr.route
                )
            ),
            '[]'::jsonb
        )
    )
    INTO v_result
    FROM search_results sr;

    RETURN v_result;
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('data', '[]'::jsonb, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql;
