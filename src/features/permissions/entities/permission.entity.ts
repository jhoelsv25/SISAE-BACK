import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ModuleEntity } from '../../modules/entities/module.entity';
import { RoleEntity } from '../../roles/entities/role.entity';

@Entity('permissions')
export class PermissionEntity extends BaseEntity {
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
  action: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => ModuleEntity, {
    eager: true,
    nullable: false,
    onDelete: 'RESTRICT',
  })
  module: ModuleEntity;

  @ManyToMany(() => RoleEntity, role => role.permissions)
  roles: RoleEntity[];
}
