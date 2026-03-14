import { DataSource } from 'typeorm';
import { AssessmentEntity } from '@features/assessments/entities/assessment.entity';
import { AssessmentStatus, AssessmentType } from '@features/assessments/enums/assessment.enum';
import { PeriodEntity } from '@features/periods/entities/period.entity';
import { SectionCourseEntity } from '@features/section-course/entities/section-course.entity';

export async function seedAssessments(dataSource: DataSource) {
  const assessmentRepo = dataSource.getRepository(AssessmentEntity);
  const periodRepo = dataSource.getRepository(PeriodEntity);
  const sectionCourseRepo = dataSource.getRepository(SectionCourseEntity);

  const sectionCourses = await sectionCourseRepo.find({ take: 100 });
  const periods = await periodRepo.find({ take: 20 });
  if (!periods.length || sectionCourses.length === 0) {
    console.log('ℹ️  Saltando assessments: faltan período o sección-curso');
    return;
  }

  const assessmentDate = new Date();
  let created = 0;
  const types = [AssessmentType.SUMMATIVE, AssessmentType.FORMATIVE, AssessmentType.DIAGNOSTIC] as const;
  const statuses = [AssessmentStatus.COMPLETED, AssessmentStatus.REVIEWED, AssessmentStatus.PENDING] as const;
  for (let i = 0; i < 100; i++) {
    const name = `Evaluación ${i + 1} - ${['Matemática', 'Comunicación', 'Ciencias', 'Inglés'][i % 4]}`;
    const sectionCourse = sectionCourses[i % sectionCourses.length];
    const period = periods[i % periods.length];
    const exists = await assessmentRepo.findOne({
      where: { name, sectionCourse: { id: sectionCourse.id } },
    });
    if (exists) continue;
    await assessmentRepo.save(
      assessmentRepo.create({
        name,
        description: `Evaluación demo ${i + 1}.`,
        type: types[i % 3],
        status: statuses[i % 3],
        weightPercentage: 20 + (i % 15),
        maxScore: 20,
        assessmentDate,
        period,
        sectionCourse,
      }),
    );
    created += 1;
  }
  console.log(`✅ Seed de evaluaciones completado (${created} nuevos)`);
}
