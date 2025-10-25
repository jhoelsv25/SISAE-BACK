import { BaseEntity } from '@common/entities/base.entity';
import { StatusType } from '@common/enums/global.enum';
import { AcademicYearEntity } from '@features/academic_years/entities/academic_year.entity';
import { CourseEntity } from '@features/courses/entities/course.entity';
import { Modality } from '@features/section-course/enums/section_course.enum';
import { SectionEntity } from '@features/sections/entities/section.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'section_courses' })
export class SectionCourseEntity extends BaseEntity {
  @Column({ type: 'enum', enum: Modality })
  modality: Modality;

  @Column({ type: 'int' })
  maxStudents: number;

  @Column({ type: 'int' })
  enrolledStudents: number;

  @Column({ type: 'enum', enum: StatusType })
  status: StatusType;

  @ManyToOne(() => AcademicYearEntity)
  academicYear: AcademicYearEntity;

  @ManyToOne(() => SectionEntity)
  @JoinColumn({ name: 'sectionId' })
  section: SectionEntity;

  @ManyToOne(() => CourseEntity)
  @JoinColumn({ name: 'courseId' })
  course: CourseEntity;
}
