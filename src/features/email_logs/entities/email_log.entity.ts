import { BaseEntity } from '@common/entities/base.entity';
import { EmailLogStatus } from '@features/email_logs/enums/email_log.enum';
import { UserEntity } from '@features/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'email_logs' })
export class EmailLogEntity extends BaseEntity {
  @Column({ type: 'text' })
  recipient: string;

  @Column({ type: 'text' })
  subject: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'enum', enum: EmailLogStatus })
  status: EmailLogStatus;

  @ManyToOne(() => UserEntity)
  user: UserEntity;
}
