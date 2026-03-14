/**
 * Seed con ~100 registros de cada tipo: colegios, cursos, secciones, estudiantes, notas, etc.
 * Para ver el sistema con bastante data. Ejecutar después del seed base: npm run seed:large
 */
import { DataSource } from 'typeorm';
import {
  AttendanceStatus,
  EnrollmentStatus,
  PaymentStatus,
  PeriodStatus,
  PeriodType,
  StatusType,
} from '@common/enums/global.enum';
import { InstitutionEntity } from '@features/institution/entities/institution.entity';
import { AcademicYearEntity } from '@features/academic_years/entities/academic_year.entity';
import { PeriodEntity } from '@features/periods/entities/period.entity';
import { GradeLevelEntity } from '@features/grade_level/entities/grade_leevel.entity';
import { SubjectAreaEntity } from '@features/subject_area/entities/subject_area.entity';
import { CourseEntity } from '@features/courses/entities/course.entity';
import { SectionEntity } from '@features/sections/entities/section.entity';
import { SectionCourseEntity } from '@features/section-course/entities/section-course.entity';
import { PersonEntity } from '@features/persons/entities/person.entity';
import { StudentEntity } from '@features/students/entities/student.entity';
import { GuardianEntity } from '@features/guardians/entities/guardian.entity';
import { StudentGuardianEntity } from '@features/student_guardians/entities/student_guardian.entity';
import { EnrollmentEntity } from '@features/enrollments/entities/enrollment.entity';
import { AttendanceEntity } from '@features/attendances/entities/attendance.entity';
import { GradeEntity } from '@features/grades/entities/grade.entity';
import { PaymentEntity } from '@features/payments/entities/payment.entity';
import { TeacherEntity } from '@features/teachers/entities/teacher.entity';
import { DocumentType, Gender, MaterialStatus } from '@features/persons/enums/person.enum';
import { StudentStatus, StudentType } from '@features/students/enums/student.enum';
import { GuardianRelationship } from '@features/guardians/enums/guardian.enum';
import { EnrollmentType } from '@features/enrollments/enums/enrollment.enum';
import { SessionType } from '@features/attendances/enums/attendance.enum';
import { GradeStatus } from '@features/grades/enums/grade.enum';
import { PaymentMethod } from '@features/payments/enums/payment.enum';
import { SectionShift } from '@features/sections/enums/section.enum';
import { Level } from '@features/grade_level/enums/grade_level.enum';
import { SubjectAreaType } from '@features/subject_area/enums/subject_area.enum';
import { Modality as CourseModality } from '@features/section-course/enums/section_course.enum';
import {
  AcademicYearStatus,
  GradingSystem,
  Modality,
} from '@features/academic_years/enums/academic_year.enum';
import {
  ContractType,
  EmployementStatus,
  LaborRegime,
  WorkloadType,
} from '@features/teachers/enums/teacher.enum';

const N_INSTITUTIONS = 10;
const N_SUBJECT_AREAS = 15;
const N_COURSES = 100;
const N_SECTIONS = 100;
const N_TEACHERS_EXTRA = 70; // teachers-seed ya crea 10
const N_STUDENTS = 100;
const N_ENROLLMENTS = 100;
const N_GRADES = 100;
const N_PAYMENTS = 100;

const SUBJECT_AREAS = [
  { code: 'MAT', name: 'Matemática' },
  { code: 'COM', name: 'Comunicación' },
  { code: 'CIE', name: 'Ciencia y Ambiente' },
  { code: 'SOC', name: 'Ciencias Sociales' },
  { code: 'ING', name: 'Inglés' },
  { code: 'ART', name: 'Arte' },
  { code: 'EDF', name: 'Educación Física' },
  { code: 'PFR', name: 'Formación Ciudadana' },
  { code: 'EMP', name: 'Emprendimiento' },
  { code: 'TEC', name: 'Educación para el Trabajo' },
  { code: 'REL', name: 'Educación Religiosa' },
  { code: 'TUT', name: 'Tutoría' },
  { code: 'RAZ', name: 'Razonamiento Matemático' },
  { code: 'LEC', name: 'Comprensión Lectora' },
  { code: 'INV', name: 'Investigación' },
];

export async function seedDemoAcademicLarge(dataSource: DataSource) {
  const institutionRepo = dataSource.getRepository(InstitutionEntity);
  const academicYearRepo = dataSource.getRepository(AcademicYearEntity);
  const periodRepo = dataSource.getRepository(PeriodEntity);
  const gradeRepo = dataSource.getRepository(GradeLevelEntity);
  const subjectRepo = dataSource.getRepository(SubjectAreaEntity);
  const courseRepo = dataSource.getRepository(CourseEntity);
  const sectionRepo = dataSource.getRepository(SectionEntity);
  const sectionCourseRepo = dataSource.getRepository(SectionCourseEntity);
  const personRepo = dataSource.getRepository(PersonEntity);
  const studentRepo = dataSource.getRepository(StudentEntity);
  const guardianRepo = dataSource.getRepository(GuardianEntity);
  const studentGuardianRepo = dataSource.getRepository(StudentGuardianEntity);
  const enrollmentRepo = dataSource.getRepository(EnrollmentEntity);
  const attendanceRepo = dataSource.getRepository(AttendanceEntity);
  const gradeEntityRepo = dataSource.getRepository(GradeEntity);
  const paymentRepo = dataSource.getRepository(PaymentEntity);
  const teacherRepo = dataSource.getRepository(TeacherEntity);

  const yearValue = 2026;

  // 1) Instituciones (colegios) - 10
  const institutions: InstitutionEntity[] = [];
  for (let i = 1; i <= N_INSTITUTIONS; i++) {
    const modularCode = `DEMO-L${String(i).padStart(3, '0')}`;
    let inst = await institutionRepo.findOne({ where: { modularCode } });
    if (!inst) {
      inst = institutionRepo.create({
        name: `Colegio Demo ${i}`,
        modularCode,
        managementType: 'Pública',
        ugel: `UGEL ${String(i).padStart(2, '0')}`,
        dre: 'DRE Lima',
        principal: `Director ${i}`,
        address: `Av Colegio ${i}`,
        district: `Lima`,
        province: `Lima`,
        department: `Lima`,
        phone: `01${String(5000000 + i).padStart(7, '0')}`,
        email: `contacto@cole${i}.demo.local`,
        status: 'ACTIVE',
        logoUrl: '',
        description: `Colegio demo ${i} para datos de prueba`,
      });
      inst = await institutionRepo.save(inst);
    }
    institutions.push(inst);
  }

  // 2) Años académicos: usar los existentes (hay UNIQUE en year a nivel global)
  let academicYears = await academicYearRepo.find({ take: 10 });
  if (academicYears.length === 0) {
    const inst0 = institutions[0];
    const ay = academicYearRepo.create({
      year: yearValue,
      name: `Año Académico ${yearValue}`,
      startDate: new Date(`${yearValue}-03-01`),
      endDate: new Date(`${yearValue}-12-15`),
      modality: Modality.IN_PERSON,
      gradingSystem: GradingSystem.PERCENTAGE,
      passingDate: new Date(`${yearValue}-12-01`),
      passingGrade: 11,
      academicCalendarUrl: '',
      status: AcademicYearStatus.ONGOING,
      institution: inst0,
    });
    const saved = await academicYearRepo.save(ay);
    academicYears = [saved];
  }

  // 3) Periodos (4 por año)
  const periods: PeriodEntity[] = [];
  for (const ay of academicYears) {
    for (let p = 1; p <= 4; p++) {
      let period = await periodRepo.findOne({
        where: { academicYear: { id: ay.id }, periodNumber: p },
      });
      if (!period) {
        period = periodRepo.create({
          periodNumber: p,
          name: `Bimestre ${p}`,
          type: PeriodType.BIMONTHLY,
          startDate: new Date(`${yearValue}-${String(2 + p).padStart(2, '0')}-01`),
          endDate: new Date(`${yearValue}-${String(3 + p).padStart(2, '0')}-28`),
          status: p === 1 ? PeriodStatus.IN_PROGRESS : PeriodStatus.PLANNED,
          academicYear: ay,
        });
        period = await periodRepo.save(period);
      }
      periods.push(period);
    }
  }

  // 4) Niveles de grado (11 por institución: Primario 1-6, Secundario 1-5)
  const gradeLevels: GradeLevelEntity[] = [];
  const gradeNames = [
    ...Array.from({ length: 6 }, (_, i) => ({ level: Level.PRIMARY, gradeNumber: i + 1, name: `Primario ${i + 1}` })),
    ...Array.from({ length: 5 }, (_, i) => ({ level: Level.SECONDARY, gradeNumber: i + 1, name: `Secundario ${i + 1}` })),
  ];
  for (const inst of institutions) {
    for (const g of gradeNames) {
      let gl = await gradeRepo.findOne({
        where: { name: g.name, institution: { id: inst.id } },
      });
      if (!gl) {
        gl = gradeRepo.create({
          level: g.level,
          gradeNumber: g.gradeNumber,
          name: g.name,
          description: g.name,
          maxCapacity: 35,
          institution: inst,
        });
        gl = await gradeRepo.save(gl);
      }
      gradeLevels.push(gl);
    }
  }

  // 5) Áreas curriculares - 15
  const subjectAreas: SubjectAreaEntity[] = [];
  for (let i = 0; i < SUBJECT_AREAS.length; i++) {
    const sa = SUBJECT_AREAS[i];
    let sub = await subjectRepo.findOne({ where: { code: sa.code } });
    if (!sub) {
      sub = subjectRepo.create({
        code: sa.code,
        name: sa.name,
        description: sa.name,
        type: SubjectAreaType.CORE,
        status: StatusType.ACTIVE,
      });
      sub = await subjectRepo.save(sub);
    }
    subjectAreas.push(sub);
  }

  // 6) Cursos - 100
  const courses: CourseEntity[] = [];
  for (let i = 1; i <= N_COURSES; i++) {
    const code = `C-${String(i).padStart(3, '0')}`;
    let course = await courseRepo.findOne({ where: { code } });
    if (!course) {
      const sub = subjectAreas[i % subjectAreas.length];
      const gl = gradeLevels[i % gradeLevels.length];
      course = courseRepo.create({
        code,
        name: `${sub.name} ${(i % 5) + 1}`,
        description: `Curso demo ${i}`,
        weeklyHours: 4 + (i % 3),
        totalHours: 120 + i,
        credits: 4,
        competencies: 'Demo',
        isMandatory: true,
        syllabusUrl: '',
        subjectArea: sub,
        grade: gl,
      });
      course = await courseRepo.save(course);
    }
    courses.push(course);
  }

  // 7) Secciones - 100 (nombre único por sección)
  const sections: SectionEntity[] = [];
  const sectionLetters = 'ABCDEFGH';
  for (let i = 0; i < N_SECTIONS; i++) {
    const gl = gradeLevels[i % gradeLevels.length];
    const ay = academicYears[i % academicYears.length];
    const name = `S${i + 1}-${sectionLetters[i % sectionLetters.length]}`;
    let section = await sectionRepo.findOne({
      where: { name, grade: { id: gl.id }, yearAcademic: { id: ay.id } },
    });
    if (!section) {
      section = sectionRepo.create({
        name,
        capacity: 35,
        status: StatusType.ACTIVE,
        shift: SectionShift.MORNING,
        tutor: `Tutor ${name}`,
        classroom: `Aula ${i + 1}`,
        availableSlots: 35,
        grade: gl,
        yearAcademic: ay,
      });
      section = await sectionRepo.save(section);
    }
    sections.push(section);
  }

  // 8) Docentes adicionales (70) - repartidos por institución
  let teachers = await teacherRepo.find({ take: 100, relations: ['institution', 'person'] });
  const inst0 = institutions[0];
  for (let i = teachers.length; i < N_TEACHERS_EXTRA + 10; i++) {
    const idx = i + 1000;
    const person = personRepo.create({
      documentType: DocumentType.DNI,
      firstName: `DocenteL${i}`,
      lastName: `Seed${i}`,
      birthDate: new Date(`198${i % 10}-01-15`),
      gender: i % 2 === 0 ? Gender.FEMALE : Gender.MALE,
      birthPlace: `LimaDL${idx}`,
      nationality: 'Peruana',
      address: `Av Doc${idx} 1`,
      district: `Lima-DL${idx}`,
      province: `Lima-DL${idx}`,
      department: `Lima-DL${idx}`,
      phone: `01${String(5100000 + idx).padStart(7, '0')}`,
      mobile: `999${String(idx).padStart(7, '0')}`,
      email: `docente.large${idx}@demo.local`,
      photoUrl: '',
      materialStatus: MaterialStatus.SINGLE,
    });
    const savedPerson = await personRepo.save(person);
    const teacher = teacherRepo.create({
      teacherCode: `TL${String(i).padStart(4, '0')}`,
      specialization: 'General',
      professionalTitle: 'Licenciado',
      university: 'UNMSM',
      graduationYear: 2010 + (i % 10),
      professionalLicense: `LIC-L-${i}`,
      contractType: ContractType.FULL_TIME,
      laborRegime: LaborRegime.PUBLIC,
      hireDate: new Date('2022-03-01'),
      terminationDate: null,
      workloadType: WorkloadType.HOURS_40,
      weeklyHours: 40,
      teachingLevel: 'Secundaria',
      employmentStatus: EmployementStatus.ACTIVE,
      institution: institutions[i % institutions.length] ?? inst0,
      person: savedPerson,
    });
    const t = await teacherRepo.save(teacher);
    teachers.push(t);
  }

  // 9) Section-Courses - 100 (vincula sección, curso, docente)
  const sectionCourses: SectionCourseEntity[] = [];
  for (let i = 0; i < N_COURSES; i++) {
    const section = sections[i % sections.length];
    const course = courses[i];
    const teacher = teachers[i % teachers.length];
    const ay = academicYears[i % academicYears.length];
    let sc = await sectionCourseRepo.findOne({
      where: { section: { id: section.id }, course: { id: course.id } },
    });
    if (!sc) {
      sc = sectionCourseRepo.create({
        modality: CourseModality.HYBRID,
        maxStudents: 35,
        enrolledStudents: 0,
        status: StatusType.ACTIVE,
        academicYear: ay,
        section,
        course,
        teacher,
      });
      sc = await sectionCourseRepo.save(sc);
    }
    sectionCourses.push(sc!);
  }

  // 10) Estudiantes - 100 (con persona única)
  const students: StudentEntity[] = [];
  for (let i = 1; i <= N_STUDENTS; i++) {
    const studentCode = `S-L-${String(i).padStart(4, '0')}`;
    let student = await studentRepo.findOne({ where: { studentCode } });
    if (!student) {
      const person = personRepo.create({
        documentType: DocumentType.DNI,
        firstName: `EstudianteL${i}`,
        lastName: `Demo${i}`,
        birthDate: new Date(`201${i % 10}-06-01`),
        gender: i % 2 === 0 ? Gender.FEMALE : Gender.MALE,
        birthPlace: `LimaEL${i}`,
        nationality: 'Peruana',
        address: `Av Est${i} 12`,
        district: `Lima-EL${i}`,
        province: `Lima-EL${i}`,
        department: `Lima-EL${i}`,
        phone: `01${String(5200000 + i).padStart(7, '0')}`,
        mobile: `998${String(i).padStart(7, '0')}`,
        email: `estudiante.l${i}@demo.local`,
        photoUrl: '',
        materialStatus: MaterialStatus.SINGLE,
      });
      const savedPerson = await personRepo.save(person);
      student = studentRepo.create({
        studentCode,
        studentType: StudentType.REGULAR,
        religion: 'Católica',
        nativeLanguage: 'Español',
        hasDisability: false,
        healthIssues: [],
        insunranceNumber: `INS-L-${i}`,
        bloodType: 'O+',
        allergies: 'Ninguna',
        medicalConditions: 'Ninguna',
        admisionDate: new Date('2024-03-01'),
        withdrawalDate: null,
        withdrawalReason: '',
        status: StudentStatus.ACTIVE,
        institution: institutions[i % institutions.length] ?? inst0,
        person: savedPerson,
      });
      student = await studentRepo.save(student);
    }
    students.push(student!);
  }

  // 11) Apoderados - 100
  const guardians: GuardianEntity[] = [];
  for (let i = 1; i <= N_STUDENTS; i++) {
    const guardianEmail = `apoderado.l${i}@demo.local`;
    let guardianPerson = await personRepo.findOne({ where: { email: guardianEmail } });
    if (!guardianPerson) {
      guardianPerson = personRepo.create({
        documentType: DocumentType.DNI,
        firstName: `ApoderadoL${i}`,
        lastName: `Demo${i}`,
        birthDate: new Date(`198${i % 10}-09-15`),
        gender: i % 2 === 0 ? Gender.FEMALE : Gender.MALE,
        birthPlace: `LimaAL${i}`,
        nationality: 'Peruana',
        address: `Av Apod${i} 45`,
        district: `Lima-AL${i}`,
        province: `Lima-AL${i}`,
        department: `Lima-AL${i}`,
        phone: `01${String(5300000 + i).padStart(7, '0')}`,
        mobile: `997${String(i).padStart(7, '0')}`,
        email: guardianEmail,
        photoUrl: '',
        materialStatus: MaterialStatus.MARRIED,
      });
      guardianPerson = await personRepo.save(guardianPerson);
    }
    let guardian = await guardianRepo.findOne({ where: { person: { id: guardianPerson.id } } });
    if (!guardian) {
      guardian = guardianRepo.create({
        occupation: 'Empleado',
        workplace: 'Empresa Demo',
        workplaceAddress: 'Av Trabajo 1',
        workplacePhone: '015900000',
        educationLevel: 'Universitario',
        monthlyIncome: 2500,
        livesWithStudent: true,
        isPrimaryGuardian: true,
        relationship: GuardianRelationship.PARENT,
        person: guardianPerson,
      });
      guardian = await guardianRepo.save(guardian);
    }
    guardians.push(guardian);
  }

  // 12) Student-Guardian
  for (let i = 0; i < N_STUDENTS; i++) {
    const existing = await studentGuardianRepo.findOne({
      where: { guardian: { id: guardians[i].id }, student: { id: students[i].id } },
    });
    if (!existing) {
      await studentGuardianRepo.save(
        studentGuardianRepo.create({
          guardian: guardians[i],
          student: students[i],
          isPrimary: true,
          pickupAuthorization: true,
          receivesNotifications: 'email',
          emergencyContact: true,
        }),
      );
    }
  }

  // 13) Matrículas - 100
  const enrollments: EnrollmentEntity[] = [];
  for (let i = 0; i < N_ENROLLMENTS; i++) {
    const student = students[i % students.length];
    const section = sections[i % sections.length];
    const ay = academicYears[i % academicYears.length];
    const code = `ENR-L-${yearValue}-${String(i + 1).padStart(4, '0')}`;
    let enrollment = await enrollmentRepo.findOne({ where: { code } });
    if (!enrollment) {
      enrollment = enrollmentRepo.create({
        code,
        enrollmentDate: new Date(`${yearValue}-03-05`),
        enrollmentType: EnrollmentType.NEW,
        status: EnrollmentStatus.ENROLLED,
        orderNumber: i + 1,
        observations: 'Seed large',
        previusSchool: 'Colegio Demo',
        previousGrade: '1',
        previusYear: yearValue - 1,
        previusAverage: 14,
        isRepeating: false,
        hasSpecialNeeds: false,
        hasScholarship: false,
        scholarshipPercentage: null,
        scholarshipDetails: null,
        student,
        section,
        academicYear: ay,
      });
      enrollment = await enrollmentRepo.save(enrollment);
    }
    enrollments.push(enrollment);
  }

  // 14) Asistencias (2 por matrícula)
  for (let i = 0; i < Math.min(enrollments.length * 2, 200); i++) {
    const enrollment = enrollments[i % enrollments.length];
    const sc = sectionCourses[i % sectionCourses.length];
    const existing = await attendanceRepo.findOne({
      where: { enrollment: { id: enrollment.id }, sectionCourse: { id: sc.id } },
    });
    if (!existing) {
      await attendanceRepo.save(
        attendanceRepo.create({
          date: new Date(),
          sessionType: SessionType.LECTURE,
          status: AttendanceStatus.PRESENT,
          checkInTime: new Date(),
          checkOutTime: null,
          observations: null,
          justificationDocument: null,
          justification: null,
          enrollment,
          sectionCourse: sc,
        }),
      );
    }
  }

  // 15) Notas - 100 (la columna teacher_id en grades referencia academic_years en este esquema)
  for (let i = 0; i < N_GRADES; i++) {
    const enrollment = enrollments[i % enrollments.length];
    const sc = sectionCourses[i % sectionCourses.length];
    const period = periods[i % periods.length];
    const academicYearForGrade = academicYears[i % academicYears.length];
    const existing = await gradeEntityRepo.findOne({
      where: { enrollment: { id: enrollment.id }, sectionCourse: { id: sc.id }, period: { id: period.id } },
    });
    if (!existing) {
      const base = 12 + (i % 7);
      await gradeEntityRepo.save(
        gradeEntityRepo.create({
          cumulativeGrade: base,
          examGrade: base + 1,
          finalGrade: base + 0.5,
          tardies: 0,
          absences: 0,
          observations: null,
          modifiedBy: 'seed-large',
          status: GradeStatus.ACTIVE,
          enrollment,
          sectionCourse: sc,
          period,
          teacher: academicYearForGrade as any,
        }),
      );
    }
  }

  // 16) Pagos - 100
  for (let i = 0; i < N_PAYMENTS; i++) {
    const enrollment = enrollments[i % enrollments.length];
    const receiptNumber = `RCPT-L-${enrollment.code}-${i + 1}`;
    const existing = await paymentRepo.findOne({ where: { receiptNumber } });
    if (!existing) {
      await paymentRepo.save(
        paymentRepo.create({
          concept: i % 3 === 0 ? 'Matrícula' : 'Pensión',
          installmentNumber: (i % 4) + 1,
          amount: 350,
          dueDate: new Date(),
          paymentDate: new Date(),
          amountPaid: i % 2 === 0 ? 350 : 0,
          paymentMethod: PaymentMethod.YAPE,
          receiptNumber,
          status: i % 2 === 0 ? PaymentStatus.COMPLETED : PaymentStatus.PENDING,
          lateFee: 0,
          observations: null,
          payerName: `Apoderado ${i + 1}`,
          enrollmentId: enrollment,
        }),
      );
    }
  }

  console.log(
    `✅ Seed large: ${institutions.length} colegios, ${courses.length} cursos, ${sections.length} secciones, ${students.length} estudiantes, ${enrollments.length} matrículas, ${N_GRADES} notas, ${N_PAYMENTS} pagos`,
  );
}
