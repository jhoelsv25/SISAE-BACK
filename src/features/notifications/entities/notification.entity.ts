import { BaseEntity } from '@common/entities/base.entity';
import { PriorityType } from '@common/enums/global.enum';
import { NotificationType } from '@features/notifications/enums/notification.enum';
import { Column, Entity, OneToMany } from 'typeorm';
import { NotificationRecipientEntity } from './notification-recipient.entity';

@Entity({ name: 'notifications' })
export class NotificationEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkUrl: string;

  @Column({ type: 'time with time zone' })
  sendAt: Date;
  @Column({ type: 'time with time zone', nullable: true })
  readAt: Date | null;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ type: 'enum', enum: PriorityType, default: PriorityType.MEDIUM })
  priority: PriorityType;

  @Column({ type: 'varchar', length: 36 })
  recipientId: string;

  @OneToMany(() => NotificationRecipientEntity, recipient => recipient.notification)
  recipients?: NotificationRecipientEntity[];
}
