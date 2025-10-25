import { BaseEntity } from '@common/entities/base.entity';
import { Level } from '@features/grade_level/enums/grade_level.enum';
import { InstitutionEntity } from '@features/institution/entities/institution.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'grade_levels' })
export class GradeLevelEntity extends BaseEntity {
  @Column({ type: 'enum', enum: Level })
  level: Level;

  @Column({ type: 'int' })
  gradeNumber: number; // Ej: 1, 2, 3, etc.

  @Column({ type: 'varchar', length: 100 })
  name: string; // Ej: "First Grade"

  @Column({ type: 'text' })
  description: string; // Ej: "First Grade of Primary Education"

  @Column({ type: 'int' })
  maxCapacity: number; // Ej: 30

  @ManyToOne(() => InstitutionEntity)
  institution: InstitutionEntity;
}
