import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { GradeLevelEntity } from '../../grade_level/entities/grade_leevel.entity';
import { SubjectAreaEntity } from '../../subject_area/entities/subject_area.entity';

@Entity({ name: 'courses' })
export class CourseEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  weeklyHours: number;

  @Column({ type: 'int' })
  totalHours: number;
  @Column({ type: 'int' })
  credits: number; //ejemplo: 4 creditos
  @Column({ type: 'text' })
  competencies: string; //ejemplo: "Trabajo en equipo, Pensamiento critico"
  @Column({ type: 'boolean' })
  isMandatory: boolean; //indica si el curso es obligatorio u optativo
  @Column({ type: 'varchar', length: 255 })
  syllabusUrl: string; //url del syllabus del curso

  @ManyToOne(() => SubjectAreaEntity)
  @JoinColumn({ name: 'subject_area_id' })
  subjectArea: SubjectAreaEntity;

  @ManyToOne(() => GradeLevelEntity)
  @JoinColumn({ name: 'grade_id' })
  grade: GradeLevelEntity;
}
