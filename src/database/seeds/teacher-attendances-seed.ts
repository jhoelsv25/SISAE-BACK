import { DataSource } from 'typeorm';

export async function seedTeacherAttendances(dataSource: DataSource) {
  const vigenciaColumn = await dataSource.query(
    `SELECT 1
       FROM information_schema.columns
      WHERE table_name = 'teacher_attendances'
        AND column_name = 'vigencia'
      LIMIT 1`,
  );
  const hasVigencia = vigenciaColumn.length > 0;

  const teachers = await dataSource.query(
    'SELECT id, teacher_code FROM teachers ORDER BY teacher_code ASC LIMIT 10',
  );

  if (!teachers.length) {
    console.log('ℹ️  No hay docentes para seed de asistencias');
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  let inserted = 0;

  for (const teacher of teachers) {
    const existing = hasVigencia
      ? await dataSource.query(
          'SELECT id FROM teacher_attendances WHERE teacher_id = $1 AND date = $2 AND vigencia = 1 LIMIT 1',
          [teacher.id, today],
        )
      : await dataSource.query(
          'SELECT id FROM teacher_attendances WHERE teacher_id = $1 AND date = $2 LIMIT 1',
          [teacher.id, today],
        );
    if (existing.length) continue;

    if (hasVigencia) {
      await dataSource.query(
        'INSERT INTO teacher_attendances (date, check_in_time, status, leave_type, observations, supporting_documents, teacher_id, vigencia) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
        [today, '08:00:00', 'present', 'Asistencia Regular', null, null, teacher.id, 1],
      );
    } else {
      await dataSource.query(
        'INSERT INTO teacher_attendances (date, check_in_time, status, leave_type, observations, supporting_documents, teacher_id) VALUES ($1,$2,$3,$4,$5,$6,$7)',
        [today, '08:00:00', 'present', 'Asistencia Regular', null, null, teacher.id],
      );
    }
    inserted += 1;
  }

  console.log(`✅ Seed de asistencias docentes completado (${inserted} nuevos)`);
}
