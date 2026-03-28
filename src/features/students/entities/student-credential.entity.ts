import { BaseEntity } from '@common/entities/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { StudentEntity } from './student.entity';

@Entity({ name: 'student_credentials' })
export class StudentCredentialEntity extends BaseEntity {
  @Column({ name: 'credential_code', type: 'varchar', length: 100, unique: true })
  credentialCode: string;

  @Column({ name: 'qr_value', type: 'text' })
  qrValue: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ name: 'issued_at', type: 'timestamp with time zone', nullable: true })
  issuedAt: Date | null;

  @Column({ name: 'expires_at', type: 'timestamp with time zone', nullable: true })
  expiresAt: Date | null;

  @OneToOne(() => StudentEntity)
  @JoinColumn({ name: 'student_id' })
  student: StudentEntity;
}
