import { BaseEntity } from 'common/entities/base.entity';
import { Permission } from 'features/permissions/entities/permission.entity';
import { User } from 'features/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity('roles')
export class Role extends BaseEntity {
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

  @OneToMany(() => User, user => user.role, {
    onDelete: 'CASCADE',
  })
  users: User[];

  @ManyToMany(() => Permission, {
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
  permissions: Permission[];
}
