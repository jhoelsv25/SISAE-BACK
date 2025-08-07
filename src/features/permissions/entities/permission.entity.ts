import { BaseEntity } from 'common/entities/base.entity';
import { Action } from 'features/actions/entities/action.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @ManyToOne('Module', {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  module: any;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  code: string;

  @ManyToOne(() => Action, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  action: Action;
}
