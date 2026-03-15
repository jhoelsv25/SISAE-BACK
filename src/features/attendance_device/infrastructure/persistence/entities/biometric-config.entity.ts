import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';

@Entity('biometric_device_configs')
export class BiometricDeviceConfigEntity extends BaseEntity {
  @Column()
  ip!: string;

  @Column({ type: 'int', default: 4370 })
  port!: number;

  @Column({ type: 'int', default: 5000 })
  timeout!: number;

  @Column({ type: 'int', default: 5200 })
  inport!: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}
