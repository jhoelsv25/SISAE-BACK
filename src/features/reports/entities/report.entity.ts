import { BaseEntity } from '@common/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { ReportFormat, ReportType } from '../enums/report.enum';

@Entity({ name: 'reports' })
export class ReportEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'enum', enum: ReportType })
  type: ReportType;

  @Column({ type: 'enum', enum: ReportFormat, nullable: true })
  format?: ReportFormat | null;

  @Column({ type: 'timestamptz', nullable: true })
  generatedAt?: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  downloadUrl?: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  createdBy?: string | null;

  @Column({ type: 'jsonb', nullable: true })
  parameters?: Record<string, unknown> | null;
}
