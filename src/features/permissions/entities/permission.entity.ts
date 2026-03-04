import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { RoleEntity } from '../../roles/entities/role.entity';

@Entity('permissions')
export class PermissionEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  slug: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  module: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'shared',
  })
  scope: string;

  @ManyToMany(() => RoleEntity, role => role.permissions)
  roles: RoleEntity[];
}
