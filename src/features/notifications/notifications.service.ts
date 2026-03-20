import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { JOBS, QUEUE } from '../../infrastruture/queues';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { FilterNotificationDto } from './dto/filter-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationRecipientEntity } from './entities/notification-recipient.entity';
import { NotificationEntity } from './entities/notification.entity';
import type { NotificationCreatedEvent } from './envents/notifications-created.listener';
import type { SendNotificationJobPayload } from './notifications.processor';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repo: Repository<NotificationEntity>,
    @InjectRepository(NotificationRecipientEntity)
    private readonly recipientRepo: Repository<NotificationRecipientEntity>,
    @InjectQueue(QUEUE.NOTIFICATIONS)
    private readonly notificationsQueue: Queue,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private resolveRecipients(dto: CreateNotificationDto): string[] {
    return [...new Set([dto.recipientId, ...(dto.recipientIds ?? [])].filter(Boolean))];
  }

  private toRealtimePayload(
    notification: NotificationEntity,
    recipient: NotificationRecipientEntity,
  ): NotificationCreatedEvent {
    return {
      id: notification.id,
      title: notification.title,
      content: notification.content,
      isRead: recipient.isRead,
      linkUrl: notification.linkUrl ?? null,
      sendAt: notification.sendAt instanceof Date ? notification.sendAt.toISOString() : String(notification.sendAt),
      readAt: recipient.readAt ? recipient.readAt.toISOString() : null,
      type: notification.type,
      priority: notification.priority,
      recipientId: recipient.recipientId,
      createdAt: notification.createdAt.toISOString(),
    };
  }

  async create(dto: CreateNotificationDto) {
    try {
      const recipientIds = this.resolveRecipients(dto);
      const notification = this.repo.create({
        ...dto,
        recipientId: recipientIds[0] ?? dto.recipientId,
      });
      await this.repo.save(notification);
      const recipients = this.recipientRepo.create(
        recipientIds.map(recipientId => ({
          notificationId: notification.id,
          recipientId,
          isRead: false,
          readAt: null,
          deliveredAt: new Date(),
        })),
      );
      await this.recipientRepo.save(recipients);
      for (const recipient of recipients) {
        this.eventEmitter.emit('notifications.created', this.toRealtimePayload(notification, recipient));
      }
      return { message: 'Notificación creada correctamente', data: notification };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear la notificación', 500);
    }
  }

  async findAll(filter: FilterNotificationDto, user?: { id?: string }) {
    try {
      const recipientId = filter.recipientId || user?.id;
      if (!recipientId) {
        throw new ErrorHandler('Destinatario no especificado', 400);
      }
      const query = this.recipientRepo
        .createQueryBuilder('recipient')
        .innerJoinAndSelect('recipient.notification', 'notification')
        .where('recipient.recipientId = :recipientId', { recipientId })
        .orderBy('notification.createdAt', 'DESC');

      if (typeof filter.isRead === 'boolean') {
        query.andWhere('recipient.isRead = :isRead', { isRead: filter.isRead });
      }

      const notifications = await query.getMany();
      return { message: 'Notificaciones encontradas correctamente', data: notifications };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener las notificaciones', 500);
    }
  }

  async findAllCursor(params: any, user?: { id?: string }) {
    try {
      const limit = Number(params?.limit ?? 20);
      const cursorDate = params?.cursorDate ? new Date(params.cursorDate) : null;
      const cursorId = params?.cursorId ?? null;
      const recipientId = params?.recipientId ?? user?.id;
      const isRead =
        typeof params?.isRead === 'string' ? params.isRead === 'true' : params?.isRead;

      if (!recipientId) {
        throw new ErrorHandler('Destinatario no especificado', 400);
      }

      const query = this.recipientRepo
        .createQueryBuilder('recipient')
        .innerJoinAndSelect('recipient.notification', 'notification')
        .where('recipient.recipientId = :recipientId', { recipientId })
        .orderBy('notification.createdAt', 'DESC')
        .addOrderBy('notification.id', 'DESC')
        .limit(limit);

      if (typeof isRead === 'boolean') {
        query.andWhere('recipient.isRead = :isRead', { isRead });
      }

      if (cursorDate && cursorId) {
        query.andWhere(
          '(notification.createdAt < :cursorDate OR (notification.createdAt = :cursorDate AND notification.id < :cursorId))',
          { cursorDate, cursorId },
        );
      }

      const rows = await query.getMany();
      const unreadCount = await this.recipientRepo.count({
        where: { recipientId, isRead: false },
      });

      const data = rows.map(row => this.toRealtimePayload(row.notification, row));
      const last = rows[rows.length - 1];

      return {
        data,
        nextCursor:
          rows.length === limit && last
            ? {
                date: last.notification.createdAt.toISOString(),
                id: last.notification.id,
              }
            : null,
        unreadCount,
      };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener las notificaciones con cursor', 500);
    }
  }

  async findOne(id: string) {
    try {
      const notification = await this.repo.findOne({ where: { id } });
      if (!notification) {
        throw new ErrorHandler('Notificación no encontrada', 404);
      }
      return { message: 'Notificación encontrada correctamente', data: notification };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener la notificación', 500);
    }
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto, user?: { id?: string }) {
    try {
      const notification = await this.repo.findOne({ where: { id } });
      if (!notification) {
        throw new ErrorHandler('Notificación no encontrada', 404);
      }
      if (typeof updateNotificationDto.isRead === 'boolean') {
        if (!user?.id) {
          throw new ErrorHandler('Usuario no autenticado', 401);
        }
        const recipient = await this.recipientRepo.findOne({
          where: { notificationId: id, recipientId: user.id },
        });
        if (!recipient) {
          throw new ErrorHandler('Notificación no encontrada para el usuario', 404);
        }
        const readAt = updateNotificationDto.isRead ? new Date() : null;
        recipient.isRead = updateNotificationDto.isRead;
        recipient.readAt = readAt;
        await this.recipientRepo.save(recipient);
        notification.isRead = updateNotificationDto.isRead;
        notification.readAt = readAt;
      }

      this.repo.merge(notification, {
        ...updateNotificationDto,
        recipientId: updateNotificationDto.recipientId ?? notification.recipientId,
      });
      await this.repo.save(notification);
      return { message: 'Notificación actualizada correctamente', data: notification };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar la notificación', 500);
    }
  }

  async markAllAsRead(user?: { id?: string }) {
    try {
      if (!user?.id) {
        throw new ErrorHandler('Usuario no autenticado', 401);
      }
      await this.recipientRepo
        .createQueryBuilder()
        .update(NotificationRecipientEntity)
        .set({ isRead: true, readAt: new Date() })
        .where('recipient_id = :recipientId', { recipientId: user.id })
        .andWhere('is_read = false')
        .execute();

      return { message: 'Notificaciones marcadas como leídas' };
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler('Ocurrió un error al marcar las notificaciones como leídas', 500);
    }
  }

  async remove(id: string) {
    try {
      const notification = await this.repo.findOne({ where: { id } });
      if (!notification) {
        throw new ErrorHandler('Notificación no encontrada', 404);
      }
      await this.repo.remove(notification);
      return { message: 'Notificación eliminada correctamente', data: notification };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al eliminar la notificación', 500);
    }
  }

  /** Encola una notificación para envío asíncrono (procesada por Redis/BullMQ) */
  async queueSend(dto: CreateNotificationDto, options?: { delay?: number }) {
    const job = await this.notificationsQueue.add(
      JOBS.SEND_NOTIFICATION,
      { notification: dto } as SendNotificationJobPayload,
      { delay: options?.delay, jobId: undefined },
    );
    return { message: 'Notificación encolada', jobId: job.id };
  }
}
