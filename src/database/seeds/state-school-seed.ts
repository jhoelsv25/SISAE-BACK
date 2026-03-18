import { DataSource } from 'typeorm';
import { PeriodStatus, PeriodType, StatusType } from '@common/enums/global.enum';
import { InstitutionEntity } from '@features/institution/entities/institution.entity';
import { AcademicYearEntity } from '@features/academic_years/entities/academic_year.entity';
import { PeriodEntity } from '@features/periods/entities/period.entity';
import { GradeLevelEntity } from '@features/grade_level/entities/grade_leevel.entity';
import { SubjectAreaEntity } from '@features/subject_area/entities/subject_area.entity';
import { CourseEntity } from '@features/courses/entities/course.entity';
import { SectionEntity } from '@features/sections/entities/section.entity';
import { SectionShift } from '@features/sections/enums/section.enum';
import { Level } from '@features/grade_level/enums/grade_level.enum';
import { SubjectAreaType } from '@features/subject_area/enums/subject_area.enum';
import { AcademicYearStatus, GradingSystem, Modality } from '@features/academic_years/enums/academic_year.enum';

export async function seedStateSchool(dataSource: DataSource) {
  const institutionRepo = dataSource.getRepository(InstitutionEntity);
  const academicYearRepo = dataSource.getRepository(AcademicYearEntity);
  const periodRepo = dataSource.getRepository(PeriodEntity);
  const gradeRepo = dataSource.getRepository(GradeLevelEntity);
  const subjectRepo = dataSource.getRepository(SubjectAreaEntity);
  const courseRepo = dataSource.getRepository(CourseEntity);
  const sectionRepo = dataSource.getRepository(SectionEntity);

  // 1) Institution: Colegio Carmelinas
  let institution = await institutionRepo.findOne({ where: { modularCode: '0432156' } }); // Sample modular code
  if (!institution) {
    institution = institutionRepo.create({
      name: 'Colegio Carmelinas',
      modularCode: '0432156',
      managementType: 'Pública',
      ugel: 'UGEL Angaraes',
      dre: 'DRE Huancavelica',
      principal: 'Director Carmelinas',
      address: 'Jr. Comercio s/n',
      district: 'Lircay',
      province: 'Angaraes',
      department: 'Huancavelica',
      phone: '067-123456',
      email: 'contacto@carmelinas.edu.pe',
      status: 'ACTIVE',
      logoUrl: '',
      description: 'Colegio estatal ubicado en Lircay, Huancavelica',
    });
    institution = await institutionRepo.save(institution);
    console.log('✅ Institución "Colegio Carmelinas" creada');
  }

  // 2) Academic year 2026
  const yearValue = 2026;
  let academicYear = await academicYearRepo.findOne({ where: { year: yearValue, institution: { id: institution.id } } });
  if (!academicYear) {
    academicYear = academicYearRepo.create({
      year: yearValue,
      name: `Año Académico ${yearValue}`,
      startDate: new Date(`${yearValue}-03-01`),
      endDate: new Date(`${yearValue}-12-15`),
      modality: Modality.IN_PERSON,
      gradingSystem: GradingSystem.PERCENTAGE,
      passingDate: new Date(`${yearValue}-12-01`),
      passingGrade: 11,
      status: AcademicYearStatus.ONGOING,
      academicCalendarUrl: 'https://carmelinas.edu.pe/calendario-2026',
      institution,
    });
    academicYear = await academicYearRepo.save(academicYear);
  }

  // 3) Periods (4)
  const periods: PeriodEntity[] = [];
  for (let i = 1; i <= 4; i++) {
    let period = await periodRepo.findOne({
      where: { academicYear: { id: academicYear.id }, periodNumber: i },
    });
    if (!period) {
      period = periodRepo.create({
        periodNumber: i,
        name: `${i}° Bimestre`,
        type: PeriodType.BIMONTHLY,
        startDate: new Date(`${yearValue}-0${(i - 1) * 2 + 3}-01`),
        endDate: new Date(`${yearValue}-0${i * 2 + 2}-30`),
        status: PeriodStatus.IN_PROGRESS,
        academicYear,
      });
      period = await periodRepo.save(period);
    }
    periods.push(period);
  }
  console.log('✅ 4 Periodos académicos creados');

  // 4) Grade levels (1 to 5)
  const gradesToCreate = [1, 2, 3, 4, 5];
  const gradeLevels: GradeLevelEntity[] = [];
  for (const gradeNum of gradesToCreate) {
    const gradeName = `${gradeNum}° Grado de Secundaria`;
    let gradeLevel = await gradeRepo.findOne({ where: { gradeNumber: gradeNum, institution: { id: institution.id }, level: Level.SECONDARY } });
    if (!gradeLevel) {
      gradeLevel = gradeRepo.create({
        level: Level.SECONDARY,
        gradeNumber: gradeNum,
        name: gradeName,
        description: `Grado ${gradeName}`,
        maxCapacity: 35,
        institution,
      });
      gradeLevel = await gradeRepo.save(gradeLevel);
    }
    gradeLevels.push(gradeLevel);
  }
  console.log('✅ 5 Grados de secundaria creados');

  // 5) Sections (A to F)
  const sectionsToCreate = ['A', 'B', 'C', 'D', 'E', 'F'];
  for (const gradeLevel of gradeLevels) {
    for (const secName of sectionsToCreate) {
      let section = await sectionRepo.findOne({ where: { name: secName, grade: { id: gradeLevel.id }, yearAcademic: { id: academicYear.id } } });
      if (!section) {
        section = sectionRepo.create({
          name: secName,
          capacity: 35,
          status: StatusType.ACTIVE,
          shift: SectionShift.MORNING,
          tutor: `Tutor de ${gradeLevel.name} - ${secName}`,
          classroom: `Aula ${gradeLevel.gradeNumber}${secName}`,
          availableSlots: 35,
          grade: gradeLevel,
          yearAcademic: academicYear,
        });
        await sectionRepo.save(section);
      }
    }
  }
  console.log('✅ Secciones A hasta la F creadas para cada grado');

  // 6) Subject Areas and Courses (Peruvian State Curriculum)
  const peruvianCurriculum = [
    { code: 'MAT', area: 'Matemática', courses: ['Matemática'] },
    { code: 'COM', area: 'Comunicación', courses: ['Comunicación', 'Inglés'] },
    { code: 'CCSS', area: 'Ciencias Sociales', courses: ['Ciencias Sociales'] },
    { code: 'CYT', area: 'Ciencia y Tecnología', courses: ['Ciencia y Tecnología'] },
    { code: 'DPCC', area: 'Desarrollo Personal, Ciudadanía y Cívica', courses: ['Desarrollo Personal, Ciudadanía y Cívica'] },
    { code: 'EF', area: 'Educación Física', courses: ['Educación Física'] },
    { code: 'ER', area: 'Educación Religiosa', courses: ['Educación Religiosa'] },
    { code: 'AC', area: 'Arte y Cultura', courses: ['Arte y Cultura'] },
    { code: 'EPT', area: 'Educación para el Trabajo', courses: ['Educación para el Trabajo'] },
    { code: 'TUT', area: 'Tutoría y Orientación Educativa', courses: ['Tutoría'] },
  ];

  for (const item of peruvianCurriculum) {
    let subject = await subjectRepo.findOne({ where: { code: item.code } });
    if (!subject) {
      subject = subjectRepo.create({
        code: item.code,
        name: item.area,
        description: `Área de ${item.area}`,
        type: SubjectAreaType.CORE,
        status: StatusType.ACTIVE,
      });
      subject = await subjectRepo.save(subject);
    }

    for (const courseName of item.courses) {
      // Registrar curso para cada grado que falte
      for (const gradeLevel of gradeLevels) {
        // Generate a unique code for each course within the area
        const courseSuffix = courseName.substring(0, 3).toUpperCase();
        const courseCode = `${item.code}-${courseSuffix}-${gradeLevel.gradeNumber}`;
        let course = await courseRepo.findOne({ where: { code: courseCode, grade: { id: gradeLevel.id } } });
        if (!course) {
          course = courseRepo.create({
            code: courseCode,
            name: `${courseName} - ${gradeLevel.gradeNumber}° Secundaria`,
            description: `${courseName} para el ${gradeLevel.gradeNumber}° grado de secundaria`,
            weeklyHours: courseName === 'Matemática' || courseName === 'Comunicación' ? 6 : 4,
            totalHours: 160,
            credits: 4,
            competencies: 'Pensamiento crítico, Trabajo en equipo, Resolución de problemas',
            isMandatory: true,
            syllabusUrl: `https://carmelinas.edu.pe/syllabus/${courseCode.toLowerCase()}`,
            subjectArea: subject,
            grade: gradeLevel,
          });
          await courseRepo.save(course);
        }
      }
    }
  }
  console.log('✅ Áreas y cursos del currículo nacional peruano creados');
}
