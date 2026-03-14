import { DataSource } from 'typeorm';
import { AssigmentEntity } from '@features/assigments/entities/assigment.entity';
import { AssigmentStatus, AssigmentType } from '@features/assigments/enums/assigment.enum';
import { SectionCourseEntity } from '@features/section-course/entities/section-course.entity';
import { TeacherEntity } from '@features/teachers/entities/teacher.entity';
import { LearningModuleEntity } from '@features/learning_modules/entities/learning_module.entity';

export async function seedAssigments(dataSource: DataSource) {
  const assigmentRepo = dataSource.getRepository(AssigmentEntity);
  const sectionCourseRepo = dataSource.getRepository(SectionCourseEntity);
  const teacherRepo = dataSource.getRepository(TeacherEntity);
  const moduleRepo = dataSource.getRepository(LearningModuleEntity);

  const sectionCourses = await sectionCourseRepo.find({ take: 100, relations: ['teacher'] });
  const modules = await moduleRepo.find({ take: 100 });
  if (sectionCourses.length === 0 || modules.length === 0) {
    console.log('ℹ️  Saltando assignments: faltan sección-curso o módulos');
    return;
  }

  const assignedDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);
  const types = [AssigmentType.HOMEWORK, AssigmentType.PROJECT, AssigmentType.QUIZ, AssigmentType.EXAM] as const;
  let created = 0;
  for (let i = 0; i < 80; i++) {
    const sectionCourse = sectionCourses[i % sectionCourses.length];
    const module = modules[i % modules.length];
    const teacher = sectionCourse.teacher;
    if (!teacher) continue;
    const title = `Tarea ${i + 1} - ${['Ejercicios', 'Proyecto', 'Quiz', 'Examen'][i % 4]}`;
    const exists = await assigmentRepo.findOne({
      where: { title, sectionCourse: { id: sectionCourse.id } },
    });
    if (exists) continue;
    await assigmentRepo.save(
      assigmentRepo.create({
        title,
        description: `Descripción de la tarea ${i + 1}.`,
        instructions: 'Entregar en PDF.',
        type: types[i % 4],
        status: AssigmentStatus.PUBLISHED,
        maxScore: 20,
        assignedDate,
        dueDate,
        lateSubmissionAllowed: i % 2 === 0,
        latePenaltyPercentage: 10,
        maxFileSizeMB: 5,
        allowedFileTypes: ['pdf', 'doc', 'docx'],
        maxAttempts: 2,
        groupAssignment: false,
        rubricUrl: '',
        sectionCourse,
        teacher,
        module,
      }),
    );
    created += 1;
  }
  console.log(`✅ Seed de tareas/assignments completado (${created} nuevos)`);
}
