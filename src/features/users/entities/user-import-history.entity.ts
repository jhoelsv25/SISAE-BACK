import { BaseEntity } from '@common/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

export enum UserImportHistoryStatus {
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity('user_import_histories')
export class UserImportHistoryEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  jobId: string;

  @Column({ type: 'varchar', length: 255 })
  fileName: string;

  @Column({ type: 'int', default: 0 })
  totalRows: number;

  @Column({ type: 'int', default: 0 })
  processedRows: number;

  @Column({ type: 'int', default: 0 })
  createdRows: number;

  @Column({ type: 'int', default: 0 })
  failedRows: number;

  @Column({
    type: 'enum',
    enum: UserImportHistoryStatus,
    default: UserImportHistoryStatus.QUEUED,
  })
  status: UserImportHistoryStatus;

  @Column({ type: 'timestamptz', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  finishedAt?: Date;

  @Column({ type: 'jsonb', nullable: true })
  errorDetails?: { row: number; message: string; rowData?: Record<string, unknown> }[];

  @ManyToOne(() => UserEntity, { nullable: true, eager: false, onDelete: 'SET NULL' })
  user?: UserEntity;
}
