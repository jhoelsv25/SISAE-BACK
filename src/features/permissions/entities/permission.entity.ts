import { BaseEntity } from 'common/entities/base.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Module } from '../../modules/entities/module.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity('permissions')
export class Permission extends BaseEntity {
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

  @ManyToOne('Module', {
    eager: true,
    nullable: false,
    onDelete: 'RESTRICT',
  })
  module: Module;

  @ManyToMany(() => Role, role => role.permissions)
  @JoinTable()
  roles: Role[];
}
