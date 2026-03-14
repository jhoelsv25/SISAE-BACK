import { DataSource } from 'typeorm';
import { AttendanceStatus, EnrollmentStatus, PaymentStatus, PeriodStatus, PeriodType, StatusType } from '@common/enums/global.enum';
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
import { AcademicYearStatus, GradingSystem, Modality } from '@features/academic_years/enums/academic_year.enum';
import { ContractType, EmployementStatus, LaborRegime, WorkloadType } from '@features/teachers/enums/teacher.enum';

export async function seedDemoAcademic(dataSource: DataSource) {
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

  // 1) Institutions
  const institutions: InstitutionEntity[] = [];
  for (const payload of [
    { name: 'Institución Demo Norte', modularCode: 'DEMO-001', ugel: 'UGEL 01' },
    { name: 'Institución Demo Sur', modularCode: 'DEMO-002', ugel: 'UGEL 02' },
  ]) {
    let institution = await institutionRepo.findOne({ where: { modularCode: payload.modularCode } });
    if (!institution) {
      institution = institutionRepo.create({
        name: payload.name,
        modularCode: payload.modularCode,
        managementType: 'Pública',
        ugel: payload.ugel,
        dre: 'DRE Demo',
        principal: 'Dirección Demo',
        address: 'Av. Principal 123',
        district: 'Lima',
        province: 'Lima',
        department: 'Lima',
        phone: '015000000',
        email: `contacto@${payload.modularCode.toLowerCase()}.demo`,
        status: 'ACTIVE',
        logoUrl: '',
        description: 'Institución creada para demo seed',
      });
      institution = await institutionRepo.save(institution);
    }
    institutions.push(institution);
  }

  // 2) Academic years
  const academicYears: AcademicYearEntity[] = [];
  for (const [index, institution] of institutions.entries()) {
    const yearValue = 2026 + index;
    let academicYear = await academicYearRepo.findOne({ where: { year: yearValue } });
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
        academicCalendarUrl: 'https://demo.local/calendar',
        status: AcademicYearStatus.ONGOING,
        institution,
      });
      academicYear = await academicYearRepo.save(academicYear);
    }
    academicYears.push(academicYear);
  }

  // 3) Periods (2)
  const periods: PeriodEntity[] = [];
  for (const academicYear of academicYears) {
    for (const [idx, payload] of [
      { periodNumber: 1, name: 'Bimestre 1', type: PeriodType.BIMONTHLY },
      { periodNumber: 2, name: 'Bimestre 2', type: PeriodType.BIMONTHLY },
    ].entries()) {
      let period = await periodRepo.findOne({
        where: { academicYear: { id: academicYear.id }, periodNumber: payload.periodNumber },
      });
      if (!period) {
        period = periodRepo.create({
          periodNumber: payload.periodNumber,
          name: payload.name,
          type: payload.type,
          startDate: new Date(`${academicYear.year}-${idx === 0 ? '03' : '05'}-01`),
          endDate: new Date(`${academicYear.year}-${idx === 0 ? '04' : '06'}-30`),
          status: PeriodStatus.IN_PROGRESS,
          academicYear,
        });
        period = await periodRepo.save(period);
      }
      periods.push(period);
    }
  }

  // 4) Grade levels
  const gradeLevels: GradeLevelEntity[] = [];
  for (const [index, institution] of institutions.entries()) {
    for (const payload of [
      { level: Level.PRIMARY, gradeNumber: 1, name: `Primero ${index + 1}` },
      { level: Level.SECONDARY, gradeNumber: 2, name: `Segundo ${index + 1}` },
    ]) {
      let gradeLevel = await gradeRepo.findOne({ where: { name: payload.name, institution: { id: institution.id } } });
      if (!gradeLevel) {
        gradeLevel = gradeRepo.create({
          level: payload.level,
          gradeNumber: payload.gradeNumber,
          name: payload.name,
          description: `Grado ${payload.name}`,
          maxCapacity: 30,
          institution,
        });
        gradeLevel = await gradeRepo.save(gradeLevel);
      }
      gradeLevels.push(gradeLevel);
    }
  }

  // 5) Subject areas
  const subjectAreas: SubjectAreaEntity[] = [];
  for (const payload of [
    { code: 'MAT', name: 'Matemática', type: SubjectAreaType.CORE },
    { code: 'COM', name: 'Comunicación', type: SubjectAreaType.CORE },
  ]) {
    let subject = await subjectRepo.findOne({ where: { code: payload.code } });
    if (!subject) {
      subject = subjectRepo.create({
        code: payload.code,
        name: payload.name,
        description: `${payload.name} - Demo`,
        type: payload.type,
        status: StatusType.ACTIVE,
      });
      subject = await subjectRepo.save(subject);
    }
    subjectAreas.push(subject);
  }

  // 6) Courses
  const courses: CourseEntity[] = [];
  for (const [index, payload] of [
    { code: 'MAT-01', name: 'Matemática I' },
    { code: 'COM-01', name: 'Comunicación I' },
  ].entries()) {
    let course = await courseRepo.findOne({ where: { code: payload.code } });
    if (!course) {
      course = courseRepo.create({
        code: payload.code,
        name: payload.name,
        description: `${payload.name} - Demo`,
        weeklyHours: 5,
        totalHours: 160,
        credits: 4,
        competencies: 'Trabajo en equipo, pensamiento crítico',
        isMandatory: true,
        syllabusUrl: 'https://demo.local/syllabus',
        subjectArea: subjectAreas[index % subjectAreas.length],
        grade: gradeLevels[index % gradeLevels.length],
      });
      course = await courseRepo.save(course);
    }
    courses.push(course);
  }

  // 7) Sections
  const sections: SectionEntity[] = [];
  for (const [index, gradeLevel] of gradeLevels.entries()) {
    const name = index % 2 === 0 ? 'A' : 'B';
    let section = await sectionRepo.findOne({ where: { name, grade: { id: gradeLevel.id } } });
    if (!section) {
      section = sectionRepo.create({
        name,
        capacity: 30,
        status: StatusType.ACTIVE,
        shift: SectionShift.MORNING,
        tutor: `Tutor ${name}`,
        classroom: `Aula ${name}`,
        availableSlots: 30,
        grade: gradeLevel,
        yearAcademic: academicYears[index % academicYears.length],
      });
      section = await sectionRepo.save(section);
    }
    sections.push(section);
  }

  // 8) Teachers (usar existentes o crear 2)
  let teachers = await teacherRepo.find({ take: 2, relations: ['institution', 'person'] });
  if (teachers.length < 2) {
    for (let i = teachers.length + 1; i <= 2; i += 1) {
      const person = await personRepo.save(
        personRepo.create({
          documentType: DocumentType.DNI,
          firstName: `DocenteDemo${i}`,
          lastName: `Seed${i}`,
          birthDate: new Date(`198${i}-01-01`),
          gender: i % 2 === 0 ? Gender.FEMALE : Gender.MALE,
          birthPlace: 'Lima',
          nationality: 'Peruana',
          address: `Calle Docente ${i}`,
          district: 'Lima',
          province: 'Lima',
          department: 'Lima',
          phone: `0151000${i}`,
          mobile: `9991000${i}`,
          email: `docente.seed${i}@demo.local`,
          photoUrl: '',
          materialStatus: MaterialStatus.SINGLE,
        }),
      );
      const teacher = await teacherRepo.save(
        teacherRepo.create({
          teacherCode: `TD${String(i).padStart(4, '0')}`,
          specialization: 'Matemática',
          professionalTitle: 'Licenciado',
          university: 'UNMSM',
          graduationYear: 2010 + i,
          professionalLicense: `LIC-${i}`,
          contractType: ContractType.FULL_TIME,
          laborRegime: LaborRegime.PUBLIC,
          hireDate: new Date('2020-03-01'),
          terminationDate: null,
          workloadType: WorkloadType.HOURS_40,
          weeklyHours: 40,
          teachingLevel: 'Secundaria',
          employmentStatus: EmployementStatus.ACTIVE,
          institution: institutions[i - 1] ?? institutions[0],
          person,
        }),
      );
      teachers.push(teacher);
    }
  }

  // 9) Section courses
  const sectionCourses: SectionCourseEntity[] = [];
  for (let i = 0; i < 2; i += 1) {
    const section = sections[i % sections.length];
    const course = courses[i % courses.length];
    const academicYear = academicYears[i % academicYears.length];
    const teacher = teachers[i % teachers.length];

    let sectionCourse = await sectionCourseRepo.findOne({
      where: {
        section: { id: section.id },
        course: { id: course.id },
      },
    });
    if (!sectionCourse) {
      sectionCourse = sectionCourseRepo.create({
        modality: CourseModality.HYBRID,
        maxStudents: 30,
        enrolledStudents: 0,
        status: StatusType.ACTIVE,
        academicYear,
        section,
        course,
        teacher,
      });
      sectionCourse = await sectionCourseRepo.save(sectionCourse);
    }
    sectionCourses.push(sectionCourse);
  }

  // 10) Students + Persons
  const students: StudentEntity[] = [];
  for (let i = 1; i <= 2; i += 1) {
    const studentCode = `S2026${String(i).padStart(3, '0')}`;
    let student = await studentRepo.findOne({ where: { studentCode } });
    if (!student) {
      const person = await personRepo.save(
        personRepo.create({
          documentType: DocumentType.DNI,
          firstName: `Estudiante${i}`,
          lastName: `Demo${i}`,
          birthDate: new Date(`201${i}-06-01`),
          gender: i % 2 === 0 ? Gender.FEMALE : Gender.MALE,
          birthPlace: 'Lima',
          nationality: 'Peruana',
          address: `Calle Estudiante ${i}`,
          district: 'Lima',
          province: 'Lima',
          department: 'Lima',
          phone: `0152000${i}`,
          mobile: `9992000${i}`,
          email: `estudiante${i}@demo.local`,
          photoUrl: '',
          materialStatus: MaterialStatus.SINGLE,
        }),
      );

      student = await studentRepo.save(
        studentRepo.create({
          studentCode,
          studentType: StudentType.REGULAR,
          religion: 'Católica',
          nativeLanguage: 'Español',
          hasDisability: false,
          healthIssues: [],
          insunranceNumber: `INS-${i}`,
          bloodType: 'O+',
          allergies: 'Ninguna',
          medicalConditions: 'Ninguna',
          admisionDate: new Date('2024-03-01'),
          withdrawalDate: null,
          withdrawalReason: '',
          status: StudentStatus.ACTIVE,
          institution: institutions[i - 1] ?? institutions[0],
          person,
        }),
      );
    }
    students.push(student);
  }

  // 11) Guardians + Persons
  const guardians: GuardianEntity[] = [];
  for (let i = 1; i <= 2; i += 1) {
    const guardianEmail = `apoderado${i}@demo.local`;
    let guardianPerson = await personRepo.findOne({ where: { email: guardianEmail } });
    if (!guardianPerson) {
      guardianPerson = await personRepo.save(
        personRepo.create({
          documentType: DocumentType.DNI,
          firstName: `Apoderado${i}`,
          lastName: `Demo${i}`,
          birthDate: new Date(`198${i}-09-15`),
          gender: i % 2 === 0 ? Gender.FEMALE : Gender.MALE,
          birthPlace: 'Lima',
          nationality: 'Peruana',
          address: `Calle Apoderado ${i}`,
          district: 'Lima',
          province: 'Lima',
          department: 'Lima',
          phone: `0153000${i}`,
          mobile: `9993000${i}`,
          email: guardianEmail,
          photoUrl: '',
          materialStatus: MaterialStatus.MARRIED,
        }),
      );
    }

    let guardian = await guardianRepo.findOne({ where: { person: { id: guardianPerson.id } } });
    if (!guardian) {
      guardian = await guardianRepo.save(
        guardianRepo.create({
          occupation: 'Empleado',
          workplace: 'Empresa Demo',
          workplaceAddress: 'Av. Trabajo 123',
          workplacePhone: '015900000',
          educationLevel: 'Universitario',
          monthlyIncome: 2500,
          livesWithStudent: true,
          isPrimaryGuardian: true,
          relationship: i % 2 === 0 ? GuardianRelationship.PARENT : GuardianRelationship.GUARDIAN,
          person: guardianPerson,
        }),
      );
    }
    guardians.push(guardian);
  }

  // 12) Student guardians (link)
  for (let i = 0; i < 2; i += 1) {
    const guardian = guardians[i % guardians.length];
    const student = students[i % students.length];

    const existing = await studentGuardianRepo.findOne({
      where: { guardian: { id: guardian.id }, student: { id: student.id } },
    });
    if (!existing) {
      await studentGuardianRepo.save(
        studentGuardianRepo.create({
          guardian,
          student,
          isPrimary: true,
          pickupAuthorization: true,
          receivesNotifications: 'email',
          emergencyContact: true,
        }),
      );
    }
  }

  // 13) Enrollments
  const enrollments: EnrollmentEntity[] = [];
  for (let i = 0; i < 2; i += 1) {
    const student = students[i % students.length];
    const section = sections[i % sections.length];
    const academicYear = academicYears[i % academicYears.length];
    const code = `ENR-${academicYear.year}-${String(i + 1).padStart(3, '0')}`;

    let enrollment = await enrollmentRepo.findOne({ where: { code } });
    if (!enrollment) {
      enrollment = await enrollmentRepo.save(
        enrollmentRepo.create({
          code,
          enrollmentDate: new Date(`${academicYear.year}-03-05`),
          enrollmentType: EnrollmentType.NEW,
          status: EnrollmentStatus.ENROLLED,
          orderNumber: i + 1,
          observations: 'Seed demo',
          previusSchool: 'Colegio Demo',
          previousGrade: '1',
          previusYear: academicYear.year - 1,
          previusAverage: 14.5,
          isRepeating: false,
          hasSpecialNeeds: false,
          hasScholarship: false,
          scholarshipPercentage: null,
          scholarshipDetails: null,
          student,
          section,
          academicYear,
        }),
      );
    }
    enrollments.push(enrollment);
  }

  // 14) Attendances
  for (let i = 0; i < 2; i += 1) {
    const enrollment = enrollments[i % enrollments.length];
    const sectionCourse = sectionCourses[i % sectionCourses.length];

    const existing = await attendanceRepo.findOne({
      where: { enrollment: { id: enrollment.id }, sectionCourse: { id: sectionCourse.id } },
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
          sectionCourse,
        }),
      );
    }
  }

  // 15) Grades
  for (let i = 0; i < 2; i += 1) {
    const enrollment = enrollments[i % enrollments.length];
    const sectionCourse = sectionCourses[i % sectionCourses.length];
    const period = periods[i % periods.length];
    const teacherYear = academicYears[i % academicYears.length];

    const existing = await gradeEntityRepo.findOne({
      where: { enrollment: { id: enrollment.id }, sectionCourse: { id: sectionCourse.id } },
    });
    if (!existing) {
      await gradeEntityRepo.save(
        gradeEntityRepo.create({
          cumulativeGrade: 15.5 + i,
          examGrade: 16.5 + i,
          finalGrade: 16.0 + i,
          tardies: 0,
          absences: 0,
          observations: null,
          modifiedBy: 'seed',
          status: GradeStatus.ACTIVE,
          enrollment,
          sectionCourse,
          period,
          teacher: teacherYear as any,
        }),
      );
    }
  }

  // 16) Payments
  for (let i = 0; i < 2; i += 1) {
    const enrollment = enrollments[i % enrollments.length];
    const receiptNumber = `RCPT-${enrollment.code}`;

    const existing = await paymentRepo.findOne({ where: { receiptNumber } });
    if (!existing) {
      await paymentRepo.save(
        paymentRepo.create({
          concept: 'Matricula',
          installmentNumber: i + 1,
          amount: 350,
          dueDate: new Date(),
          paymentDate: new Date(),
          amountPaid: 350,
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

  console.log('✅ Demo academic seed completed');
}
