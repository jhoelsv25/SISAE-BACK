import { BaseEntity } from 'common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('actions')
export class Action extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  description?: string;
}
