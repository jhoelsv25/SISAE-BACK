import { BaseEntity } from '@common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'institutions' })
export class InstitutionEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  modularCode: string;

  @Column({ type: 'varchar', length: 50 })
  managementType: string;

  @Column({ type: 'varchar', length: 50 })
  ugel: string;

  @Column({ type: 'varchar', length: 50 })
  dre: string;

  @Column({ type: 'varchar', length: 50 })
  principal: string;

  @Column({ type: 'varchar', length: 100 })
  address: string;

  @Column({ type: 'varchar', length: 50 })
  district: string;

  @Column({ type: 'varchar', length: 50 })
  province: string;

  @Column({ type: 'varchar', length: 50 })
  department: string;

  @Column({ type: 'varchar', length: 50 })
  phone: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  status: string;

  @Column({ type: 'varchar', length: 255 })
  logoUrl: string;

  @Column({ type: 'text' })
  description: string;
}
