import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ActionEntity } from '../../actions/entities/action.entity';
import { ModuleEntity } from '../../modules/entities/module.entity';
import { RoleEntity } from '../../roles/entities/role.entity';

@Entity('permissions')
export class PermissionEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  key: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToMany(() => ActionEntity, { eager: true })
  @JoinTable({
    name: 'permission_actions', // tabla pivote
    joinColumn: { name: 'permission_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'action_id', referencedColumnName: 'id' },
  })
  actions: ActionEntity[];

  @ManyToOne(() => ModuleEntity, {
    eager: true,
    nullable: false,
    onDelete: 'RESTRICT',
  })
  module: ModuleEntity;

  @ManyToMany(() => RoleEntity, role => role.permissions)
  roles: RoleEntity[];
}
