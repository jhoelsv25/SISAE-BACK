import { BaseEntity } from '@common/entities/base.entity';
import { EnrollmentStatus } from '@common/enums/global.enum';
import { AcademicYearEntity } from '@features/academic_years/entities/academic_year.entity';
import { EnrollmentType } from '@features/enrollments/enums/enrollment.enum';
import { SectionEntity } from '@features/sections/entities/section.entity';
import { StudentEntity } from '@features/students/entities/student.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'enrollments' })
export class EnrollmentEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'date' })
  enrollmentDate: Date;

  @Column({ type: 'enum', enum: EnrollmentType })
  enrollmentType: EnrollmentType;

  @Column({ type: 'enum', enum: EnrollmentStatus })
  status: EnrollmentStatus;

  @Column({ type: 'int' })
  orderNumber: number;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @Column({ type: 'varchar', length: 100 })
  previusSchool: string;

  @Column({ type: 'varchar', length: 20 })
  previousGrade: string;

  @Column({ type: 'int' })
  previusYear: number;

  @Column({ type: 'float' })
  previusAverage: number;

  @Column({ type: 'boolean', default: false })
  isRepeating: boolean;

  @Column({ type: 'boolean', default: false })
  hasSpecialNeeds: boolean;

  @Column({ type: 'boolean', default: false })
  hasScholarship: boolean;

  @Column({ type: 'float', nullable: true })
  scholarshipPercentage: number;

  @Column({ type: 'text', nullable: true })
  scholarshipDetails: string;

  @ManyToOne(() => StudentEntity)
  student: StudentEntity;

  @ManyToOne(() => SectionEntity)
  section: SectionEntity;

  @ManyToOne(() => AcademicYearEntity)
  academicYear: AcademicYearEntity;
}
