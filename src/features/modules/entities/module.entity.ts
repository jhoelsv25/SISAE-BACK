import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PermissionEntity } from '../../permissions/entities/permission.entity';

@Entity('modules')
export class ModuleEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({ unique: true })
  key: string;

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
    length: 20,
    nullable: false,
    default: 'private',
  })
  visibility: 'private' | 'public';

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  icon: string;

  @ManyToOne(() => ModuleEntity, module => module.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  parent: ModuleEntity | null;

  @OneToMany(() => ModuleEntity, module => module.parent, {
    cascade: true,
  })
  children: ModuleEntity[];

  @OneToMany(() => PermissionEntity, permission => permission.module, {
    cascade: true,
  })
  permissions: PermissionEntity[];
}
