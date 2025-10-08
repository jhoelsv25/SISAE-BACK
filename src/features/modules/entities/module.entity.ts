import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PermissionEntity } from '../../permissions/entities/permission.entity';

@Entity('modules')
export class ModuleEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ unique: true })
  key: string; // ej: 'students', 'grades', 'academic'

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  path?: string; // ej: '/students' o '/academic/grades'

  @Column({
    type: 'varchar',
    length: 20,
    default: 'private',
  })
  visibility: 'private' | 'public'; // control de acceso

  @Column({ type: 'varchar', length: 255, nullable: true })
  icon?: string;

  @Column({ default: true })
  isActive: boolean; // permite ocultar módulos temporalmente

  @Column({ default: false })
  isSystem: boolean; // protege módulos base del sistema

  // 🔁 Relación recursiva (módulo padre)
  @ManyToOne(() => ModuleEntity, module => module.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: ModuleEntity | null;

  // 🔁 Submódulos (hijos)
  @OneToMany(() => ModuleEntity, module => module.parent, {
    cascade: true,
  })
  children: ModuleEntity[];

  // 🔗 Permisos asociados a este módulo
  @OneToMany(() => PermissionEntity, permission => permission.module, {
    cascade: true,
  })
  permissions: PermissionEntity[];
}
