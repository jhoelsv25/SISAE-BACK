CREATE OR REPLACE FUNCTION get_students_cursor(p_params JSONB)
RETURNS JSONB AS $$
DECLARE
    v_limit INT := LEAST(COALESCE((p_params->>'limit')::INT, 20), 500);
    v_cursor_date TIMESTAMPTZ := CASE
        WHEN COALESCE(p_params->>'cursorDate', '') = '' THEN NULL
        ELSE (p_params->>'cursorDate')::TIMESTAMPTZ
    END;
    v_cursor_id UUID := CASE
        WHEN COALESCE(p_params->>'cursorId', '') = '' THEN NULL
        ELSE (p_params->>'cursorId')::UUID
    END;
    v_search TEXT := NULLIF(TRIM(COALESCE(p_params->>'search', '')), '');
    v_status TEXT := NULLIF(TRIM(COALESCE(p_params->>'status', '')), '');
    v_student_type TEXT := NULLIF(TRIM(COALESCE(p_params->>'studentType', '')), '');
    v_user_id UUID := CASE
        WHEN COALESCE(p_params->>'userId', '') = '' THEN NULL
        ELSE (p_params->>'userId')::UUID
    END;
    v_role_name TEXT := LOWER(COALESCE(p_params->>'roleName', ''));
    v_result JSONB;
BEGIN
    WITH filtered_students AS (
        SELECT
            s.id,
            s.created_at AS "createdAt",
            p.id AS "personId",
            p.first_name AS "firstName",
            p.last_name AS "lastName",
            CASE
                WHEN UPPER(COALESCE(p.document_type::text, '')) = 'DNI' THEN 'DNI'
                WHEN UPPER(COALESCE(p.document_type::text, '')) = 'PASSPORT' THEN 'PASSPORT'
                ELSE 'CE'
            END AS "docType",
            COALESCE(p.document_number, '') AS "docNumber",
            CASE
                WHEN UPPER(COALESCE(p.gender::text, '')) = 'MALE' THEN 'M'
                WHEN UPPER(COALESCE(p.gender::text, '')) = 'FEMALE' THEN 'F'
                ELSE 'O'
            END AS "gender",
            TO_CHAR(p.birth_date, 'YYYY-MM-DD') AS "birthDate",
            COALESCE(p.phone, '') AS "phone",
            COALESCE(p.address, '') AS "address",
            COALESCE(u.email, p.email, '') AS "email",
            COALESCE(u.username, '') AS "username",
            s.student_code AS "studentCode",
            GREATEST(
                DATE_PART('year', AGE(CURRENT_DATE, p.birth_date))::INT,
                0
            ) AS "age",
            COALESCE(latest_grade.grade_name, '-') AS "grade",
            COALESCE(u.is_active, s.status::text = 'ACTIVE') AS "isActive",
            COALESCE(p.photo_url, '') AS "photoUrl",
            CASE
                WHEN i.id IS NOT NULL THEN jsonb_build_object('id', i.id, 'name', i.name)
                ELSE NULL
            END AS institution
        FROM students s
        LEFT JOIN persons p ON p.id = s.person_id
        LEFT JOIN users u ON u.person_id = p.id
        LEFT JOIN institutions i ON i.id = s.institution_id
        LEFT JOIN LATERAL (
            SELECT
                CASE
                    WHEN gl.name IS NOT NULL AND gl.name <> '' THEN gl.name
                    WHEN gl.level IS NOT NULL AND gl.grade_number IS NOT NULL THEN gl.grade_number::TEXT || ' ' || gl.level
                    ELSE '-'
                END AS grade_name
            FROM enrollments e
            LEFT JOIN sections sec ON sec.id = e.section_id
            LEFT JOIN grade_levels gl ON gl.id = sec."gradeId"
            WHERE e.student_id = s.id
            ORDER BY e.created_at DESC, e.id DESC
            LIMIT 1
        ) latest_grade ON TRUE
        WHERE
            (
                v_user_id IS NULL
                OR v_role_name = ''
                OR (v_role_name LIKE '%super%' AND v_role_name LIKE '%admin%')
                OR v_role_name LIKE '%admin%'
                OR v_role_name LIKE '%director%'
                OR v_role_name LIKE '%subdirector%'
                OR v_role_name LIKE '%ugel%'
                OR (
                    (v_role_name LIKE '%docente%' OR v_role_name LIKE '%teacher%')
                    AND EXISTS (
                        SELECT 1
                        FROM users ux
                        INNER JOIN teachers t ON t.person_id = ux.person_id
                        INNER JOIN section_courses sc ON sc."teacherId" = t.id
                        INNER JOIN enrollments e2
                            ON e2.section_id = sc."sectionId"
                           AND e2.academic_year_id = sc.academic_year_id
                        WHERE ux.id = v_user_id
                          AND e2.student_id = s.id
                    )
                )
                OR (
                    (v_role_name LIKE '%alumno%' OR v_role_name LIKE '%student%')
                    AND EXISTS (
                        SELECT 1
                        FROM users ux
                        INNER JOIN students self_student ON self_student.person_id = ux.person_id
                        WHERE ux.id = v_user_id
                          AND self_student.id = s.id
                    )
                )
                OR (
                    (v_role_name LIKE '%apoderado%' OR v_role_name LIKE '%guardian%' OR v_role_name LIKE '%tutor%')
                    AND EXISTS (
                        SELECT 1
                        FROM users ux
                        INNER JOIN guardians g ON g.person_id = ux.person_id
                        INNER JOIN student_guardians sg ON sg.guardian_id = g.id
                        WHERE ux.id = v_user_id
                          AND sg.student_id = s.id
                    )
                )
            )
            AND (v_status IS NULL OR s.status::text = v_status)
            AND (v_student_type IS NULL OR s.student_type::text = v_student_type)
            AND (
                v_search IS NULL
                OR s.student_code ILIKE '%' || v_search || '%'
                OR p.first_name ILIKE '%' || v_search || '%'
                OR p.last_name ILIKE '%' || v_search || '%'
                OR p.email ILIKE '%' || v_search || '%'
                OR p.document_number ILIKE '%' || v_search || '%'
                OR u.username ILIKE '%' || v_search || '%'
            )
            AND (
                v_cursor_date IS NULL OR v_cursor_id IS NULL
                OR s.created_at < v_cursor_date
                OR (s.created_at = v_cursor_date AND s.id < v_cursor_id)
            )
        ORDER BY s.created_at DESC, s.id DESC
        LIMIT v_limit
    ),
    students_array AS (
        SELECT COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'id', fs.id,
                    'firstName', fs."firstName",
                    'lastName', fs."lastName",
                    'docType', fs."docType",
                    'docNumber', fs."docNumber",
                    'gender', fs."gender",
                    'birthDate', fs."birthDate",
                    'phone', fs."phone",
                    'address', fs."address",
                    'email', fs."email",
                    'username', fs."username",
                    'studentCode', fs."studentCode",
                    'age', fs."age",
                    'grade', fs."grade",
                    'isActive', fs."isActive",
                    'photoUrl', fs."photoUrl",
                    'personId', fs."personId",
                    'institution', fs.institution
                )
            ),
            '[]'::jsonb
        ) AS data
        FROM filtered_students fs
    ),
    last_item AS (
        SELECT "createdAt", id
        FROM filtered_students
        ORDER BY "createdAt" ASC, id ASC
        LIMIT 1
    )
    SELECT jsonb_build_object(
        'data', sa.data,
        'nextCursor', CASE
            WHEN (SELECT COUNT(*) FROM filtered_students) = v_limit THEN
                (SELECT jsonb_build_object('date', li."createdAt", 'id', li.id) FROM last_item li)
            ELSE NULL
        END
    )
    INTO v_result
    FROM students_array sa;

    RETURN v_result;
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'data', '[]'::jsonb,
        'nextCursor', NULL,
        'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql;
