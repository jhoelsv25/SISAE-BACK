import { BaseEntity } from '@common/entities/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AcademicYearEntity } from '../../academic_years/entities/academic_year.entity';
import { EnrollmentEntity } from '../../enrollments/entities/enrollment.entity';
import { PeriodEntity } from '../../periods/entities/period.entity';
import { SectionCourseEntity } from '../../section-course/entities/section-course.entity';
import { SectionEntity } from '../../sections/entities/section.entity';
import { TeacherEntity } from '../../teachers/entities/teacher.entity';
import { GradeStatus } from '../enums/grade.enum';

@Entity('grades')
export class GradeEntity extends BaseEntity {
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  cumulativeGrade: number; // Calificación acumulativa

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  examGrade: number; // Calificación de examen final

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  finalGrade: number; // Calificación final del curso

  @Column({ type: 'int', default: 0 })
  tardies: number; // Número de tardanzas permitidas

  @Column({ type: 'int', default: 0 })
  absences: number; // Número de ausencias permitidas

  @Column({ type: 'text', nullable: true })
  observations?: string;

  @Column({ type: 'varchar', length: 100 })
  modifiedBy: string;

  @Column({ type: 'enum', enum: GradeStatus, default: GradeStatus.ACTIVE })
  status: GradeStatus;

  @ManyToOne(() => EnrollmentEntity)
  enrollment: EnrollmentEntity;

  @ManyToOne(() => SectionCourseEntity)
  sectionCourse: SectionCourseEntity;

  @ManyToOne(() => PeriodEntity)
  period: PeriodEntity;

  @ManyToOne(() => AcademicYearEntity)
  teacher: TeacherEntity;

  // Relación con Secciones
  @OneToMany(() => SectionEntity, section => section.grade, { cascade: true })
  sections: SectionEntity[];
}
