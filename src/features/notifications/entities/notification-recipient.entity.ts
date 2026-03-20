import { BaseEntity } from '@common/entities/base.entity';
import { UserEntity } from '@features/users/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { NotificationEntity } from './notification.entity';

@Entity({ name: 'notification_recipients' })
@Index('idx_notification_recipients_notification', ['notificationId'])
@Index('idx_notification_recipients_recipient', ['recipientId'])
@Index('idx_notification_recipients_notification_recipient', ['notificationId', 'recipientId'], {
  unique: true,
})
export class NotificationRecipientEntity extends BaseEntity {
  @Column({ type: 'uuid', name: 'notification_id' })
  notificationId: string;

  @ManyToOne(() => NotificationEntity, notification => notification.recipients, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'notification_id' })
  notification: NotificationEntity;

  @Column({ type: 'uuid', name: 'recipient_id' })
  recipientId: string;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipient_id' })
  recipient?: UserEntity | null;

  @Column({ type: 'boolean', name: 'is_read', default: false })
  isRead: boolean;

  @Column({ type: 'timestamptz', name: 'read_at', nullable: true })
  readAt: Date | null;

  @Column({ type: 'timestamptz', name: 'delivered_at', nullable: true })
  deliveredAt: Date | null;
}
