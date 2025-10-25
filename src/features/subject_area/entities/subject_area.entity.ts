import { BaseEntity } from '@common/entities/base.entity';
import { StatusType } from '@common/enums/global.enum';
import { SubjectAreaType } from '@features/subject_area/enums/subject_area.enum';
import { Column, Entity } from 'typeorm';

@Entity('subject_areas')
export class SubjectAreaEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: SubjectAreaType })
  type: SubjectAreaType;

  @Column({ type: 'enum', enum: StatusType, default: StatusType.ACTIVE })
  status: StatusType;
}
