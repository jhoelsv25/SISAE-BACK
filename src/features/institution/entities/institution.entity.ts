import { BaseEntity } from '@common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'institutions' })
export class InstitutionEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  modularCode: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  managementType?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ugel?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  dre?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  principal?: string;

  @Column({ type: 'varchar', length: 100 })
  address: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  district?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  province?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  department?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 20 })
  status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logoUrl?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;
}
