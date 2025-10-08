import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PermissionEntity } from '../../permissions/entities/permission.entity';

@Entity('actions')
export class ActionEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  key: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @OneToMany(() => PermissionEntity, permission => permission.action)
  permissions: PermissionEntity[];
}
