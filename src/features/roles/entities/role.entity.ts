import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PermissionEntity } from '../../permissions/entities/permission.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('roles')
export class RoleEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  description?: string;

  @OneToMany(() => UserEntity, user => user.role, {
    onDelete: 'CASCADE',
  })
  users: UserEntity[];

  @ManyToMany(() => PermissionEntity, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions: PermissionEntity[];
}
