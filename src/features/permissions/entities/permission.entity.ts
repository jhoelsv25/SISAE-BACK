import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ActionEntity } from '../../actions/entities/action.entity';
import { ModuleEntity } from '../../modules/entities/module.entity';
import { RoleEntity } from '../../roles/entities/role.entity';

@Entity('permissions')
export class PermissionEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  key: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => ActionEntity, action => action.permissions, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  action: ActionEntity;

  @ManyToOne(() => ModuleEntity, {
    eager: true,
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'module_id' })
  module: ModuleEntity;

  @ManyToMany(() => RoleEntity, role => role.permissions)
  roles: RoleEntity[];
}
