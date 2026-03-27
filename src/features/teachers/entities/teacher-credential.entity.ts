import { BaseEntity } from '@common/entities/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { TeacherEntity } from './teacher.entity';

@Entity({ name: 'teacher_credentials' })
export class TeacherCredentialEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  credentialCode: string;

  @Column({ type: 'text' })
  qrValue: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'timestamp with time zone', nullable: true })
  issuedAt: Date | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  expiresAt: Date | null;

  @OneToOne(() => TeacherEntity)
  @JoinColumn({ name: 'teacher_id' })
  teacher: TeacherEntity;
}
