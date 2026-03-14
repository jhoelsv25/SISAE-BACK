import { DataSource } from 'typeorm';
import { LearningModuleEntity } from '@features/learning_modules/entities/learning_module.entity';
import { SectionCourseEntity } from '@features/section-course/entities/section-course.entity';

export async function seedLearningModules(dataSource: DataSource) {
  const moduleRepo = dataSource.getRepository(LearningModuleEntity);
  const sectionCourseRepo = dataSource.getRepository(SectionCourseEntity);

  const sectionCourses = await sectionCourseRepo.find({ take: 100 });
  if (sectionCourses.length === 0) {
    console.log('ℹ️  Saltando learning modules: no hay sección-curso');
    return;
  }

  const baseDate = new Date();
  const startDate = new Date(baseDate);
  const endDate = new Date(baseDate);
  endDate.setMonth(endDate.getMonth() + 2);

  const baseTitles = ['Números reales', 'Expresiones algebraicas', 'Comprensión de textos', 'Ciencias naturales', 'Historia del Perú'];
  let created = 0;
  for (let i = 0; i < 80; i++) {
    const title = `${baseTitles[i % baseTitles.length]} Módulo ${i + 1}`;
    const sectionCourse = sectionCourses[i % sectionCourses.length];
    const exists = await moduleRepo.findOne({
      where: { title, sectionCourse: { id: sectionCourse.id } },
    });
    if (exists) continue;
    await moduleRepo.save(
      moduleRepo.create({
        title,
        description: `Contenido del módulo ${i + 1}.`,
        displayOrder: (i % 5) + 1,
        startDate,
        endDate,
        isPublished: true,
        sectionCourse,
      }),
    );
    created += 1;
  }
  console.log(`✅ Seed de módulos de aprendizaje completado (${created} nuevos)`);
}
