import { BaseEntity } from '@common/entities/base.entity';
import { CourseEntity } from '@features/courses/entities/course.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
@Entity({ name: 'competencies' })
export class CompetencyEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  expectedAchievement: string; //descripcion del nivel esperado

  @ManyToOne(() => CourseEntity, course => course.competencies)
  course: CourseEntity;
}
