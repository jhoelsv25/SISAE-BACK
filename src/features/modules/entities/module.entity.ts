import { BaseEntity } from 'common/entities/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity('modules')
export class Module extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'int',
    default: 0,
  })
  position: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  path: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  icon: string;

  @ManyToOne(() => Module, module => module.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  parent: Module | null;

  @OneToMany(() => Module, module => module.parent, {
    cascade: true,
  })
  children: Module[];

  @OneToMany(() => Permission, permission => permission.module, {
    cascade: true,
  })
  permissions: Permission[];
}
