import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnrollmentEntity } from '@features/enrollments/entities/enrollment.entity';
import { GuardianEntity } from '@features/guardians/entities/guardian.entity';
import { SectionCourseEntity } from '@features/section-course/entities/section-course.entity';
import { StudentGuardianEntity } from '@features/student_guardians/entities/student_guardian.entity';
import { StudentEntity } from '@features/students/entities/student.entity';
import { TeacherEntity } from '@features/teachers/entities/teacher.entity';
import { Repository } from 'typeorm';
import { RecipientType } from '../announcements/enums/announcement.enum';

@Injectable()
export class NotificationAudienceService {
  constructor(
    @InjectRepository(TeacherEntity)
    private readonly teacherRepo: Repository<TeacherEntity>,
    @InjectRepository(StudentEntity)
    private readonly studentRepo: Repository<StudentEntity>,
    @InjectRepository(GuardianEntity)
    private readonly guardianRepo: Repository<GuardianEntity>,
    @InjectRepository(EnrollmentEntity)
    private readonly enrollmentRepo: Repository<EnrollmentEntity>,
    @InjectRepository(StudentGuardianEntity)
    private readonly studentGuardianRepo: Repository<StudentGuardianEntity>,
    @InjectRepository(SectionCourseEntity)
    private readonly sectionCourseRepo: Repository<SectionCourseEntity>,
  ) {}

  private unique(ids: Array<string | null | undefined>): string[] {
    return [...new Set(ids.filter((id): id is string => Boolean(id)))];
  }

  private async getTeacherUserIds(): Promise<string[]> {
    const rows = await this.teacherRepo
      .createQueryBuilder('teacher')
      .innerJoin('teacher.person', 'person')
      .innerJoin('person.user', 'user')
      .select('user.id', 'id')
      .getRawMany<{ id: string }>();

    return this.unique(rows.map(row => row.id));
  }

  private async getStudentUserIds(): Promise<string[]> {
    const rows = await this.studentRepo
      .createQueryBuilder('student')
      .innerJoin('student.person', 'person')
      .innerJoin('person.user', 'user')
      .select('user.id', 'id')
      .getRawMany<{ id: string }>();

    return this.unique(rows.map(row => row.id));
  }

  async getAllGuardianUserIds(): Promise<string[]> {
    const rows = await this.guardianRepo
      .createQueryBuilder('guardian')
      .innerJoin('guardian.person', 'person')
      .innerJoin('person.user', 'user')
      .select('user.id', 'id')
      .getRawMany<{ id: string }>();

    return this.unique(rows.map(row => row.id));
  }

  private async getStudentUserIdsBySection(sectionId: string, academicYearId?: string): Promise<string[]> {
    const qb = this.enrollmentRepo
      .createQueryBuilder('enrollment')
      .innerJoin('enrollment.student', 'student')
      .innerJoin('student.person', 'person')
      .innerJoin('person.user', 'user')
      .innerJoin('enrollment.section', 'section')
      .select('user.id', 'id')
      .where('section.id = :sectionId', { sectionId });

    if (academicYearId) {
      qb.innerJoin('enrollment.academicYear', 'academicYear').andWhere(
        'academicYear.id = :academicYearId',
        { academicYearId },
      );
    }

    const rows = await qb.getRawMany<{ id: string }>();
    return this.unique(rows.map(row => row.id));
  }

  async getTeacherUserIdsBySectionCourse(sectionCourseId: string): Promise<string[]> {
    const rows = await this.sectionCourseRepo
      .createQueryBuilder('sectionCourse')
      .leftJoin('sectionCourse.teacher', 'teacher')
      .leftJoin('teacher.person', 'person')
      .leftJoin('person.user', 'user')
      .select('user.id', 'id')
      .where('sectionCourse.id = :sectionCourseId', { sectionCourseId })
      .getRawMany<{ id: string | null }>();

    return this.unique(rows.map(row => row.id));
  }

  async getStudentUserIdsBySectionCourse(sectionCourseId: string): Promise<string[]> {
    const sectionCourse = await this.sectionCourseRepo.findOne({
      where: { id: sectionCourseId },
      relations: ['section', 'academicYear'],
    });
    if (!sectionCourse?.section?.id) return [];
    return this.getStudentUserIdsBySection(sectionCourse.section.id, sectionCourse.academicYear?.id);
  }

  async getGuardianUserIdsBySectionCourse(sectionCourseId: string): Promise<string[]> {
    const sectionCourse = await this.sectionCourseRepo.findOne({
      where: { id: sectionCourseId },
      relations: ['section', 'academicYear'],
    });
    if (!sectionCourse?.section?.id) return [];

    const rows = await this.studentGuardianRepo
      .createQueryBuilder('sg')
      .innerJoin('sg.student', 'student')
      .innerJoin('student.person', 'studentPerson')
      .innerJoin('sg.guardian', 'guardian')
      .innerJoin('guardian.person', 'guardianPerson')
      .innerJoin('guardianPerson.user', 'user')
      .innerJoin('enrollments', 'enrollment', 'enrollment.studentId = student.id')
      .innerJoin('enrollment.section', 'section')
      .innerJoin('enrollment.academicYear', 'academicYear')
      .select('user.id', 'id')
      .where('section.id = :sectionId', { sectionId: sectionCourse.section.id })
      .andWhere('academicYear.id = :academicYearId', { academicYearId: sectionCourse.academicYear?.id })
      .getRawMany<{ id: string }>();

    return this.unique(rows.map(row => row.id));
  }

  async getAudienceForAnnouncement(
    recipient: RecipientType,
    gradeId?: string,
    sectionId?: string,
  ): Promise<string[]> {
    const includeTeachers = recipient === RecipientType.TEACHERS || recipient === RecipientType.ALL;
    const includeStudents = recipient === RecipientType.STUDENTS || recipient === RecipientType.ALL;
    const includeGuardians = recipient === RecipientType.GUARDIANS || recipient === RecipientType.ALL;

    const [teacherIds, studentIds, guardianIds] = await Promise.all([
      includeTeachers ? this.getTeacherUserIds() : Promise.resolve([]),
      includeStudents
        ? sectionId
          ? this.getStudentUserIdsBySection(sectionId)
          : gradeId
          ? this.getStudentUserIdsByGrade(gradeId)
          : this.getStudentUserIds()
        : Promise.resolve([]),
      includeGuardians
        ? sectionId
          ? this.getGuardianUserIdsBySection(sectionId)
          : this.getAllGuardianUserIds()
        : Promise.resolve([]),
    ]);

    return this.unique([...teacherIds, ...studentIds, ...guardianIds]);
  }

  async getGuardianUserIdsBySection(sectionId: string): Promise<string[]> {
    const rows = await this.studentGuardianRepo
      .createQueryBuilder('sg')
      .innerJoin('sg.student', 'student')
      .innerJoin('sg.guardian', 'guardian')
      .innerJoin('guardian.person', 'guardianPerson')
      .innerJoin('guardianPerson.user', 'user')
      .innerJoin('enrollments', 'enrollment', 'enrollment.studentId = student.id')
      .innerJoin('enrollment.section', 'section')
      .select('user.id', 'id')
      .where('section.id = :sectionId', { sectionId })
      .getRawMany<{ id: string }>();

    return this.unique(rows.map(row => row.id));
  }

  async getStudentUserIdsByGrade(gradeId: string): Promise<string[]> {
    const rows = await this.enrollmentRepo
      .createQueryBuilder('enrollment')
      .innerJoin('enrollment.student', 'student')
      .innerJoin('student.person', 'person')
      .innerJoin('person.user', 'user')
      .innerJoin('enrollment.section', 'section')
      .innerJoin('section.grade', 'grade')
      .select('user.id', 'id')
      .where('grade.id = :gradeId', { gradeId })
      .getRawMany<{ id: string }>();

    return this.unique(rows.map(row => row.id));
  }

  async getGuardianUserIdsByStudent(studentId: string): Promise<string[]> {
    const rows = await this.studentGuardianRepo
      .createQueryBuilder('sg')
      .innerJoin('sg.guardian', 'guardian')
      .innerJoin('guardian.person', 'person')
      .innerJoin('person.user', 'user')
      .select('user.id', 'id')
      .where('sg.studentId = :studentId', { studentId })
      .getRawMany<{ id: string }>();

    return this.unique(rows.map(row => row.id));
  }
}
