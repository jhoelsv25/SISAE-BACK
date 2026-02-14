import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { JOBS, QUEUE } from '../../infrastruture/queues';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { FilterNotificationDto } from './dto/filter-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationEntity } from './entities/notification.entity';
import type { SendNotificationJobPayload } from './notifications.processor';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repo: Repository<NotificationEntity>,
    @InjectQueue(QUEUE.NOTIFICATIONS)
    private readonly notificationsQueue: Queue,
  ) {}

  async create(dto: CreateNotificationDto) {
    try {
      const notification = this.repo.create(dto);
      await this.repo.save(notification);
      return { message: 'Notificación creada correctamente', data: notification };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al crear la notificación', 500);
    }
  }

  async findAll(filter: FilterNotificationDto) {
    try {
      const notifications = await this.repo.find({ where: filter });
      return { message: 'Notificaciones encontradas correctamente', data: notifications };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al obtener las notificaciones', 500);
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

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    try {
      const notification = await this.repo.findOne({ where: { id } });
      if (!notification) {
        throw new ErrorHandler('Notificación no encontrada', 404);
      }
      this.repo.merge(notification, updateNotificationDto);
      await this.repo.save(notification);
      return { message: 'Notificación actualizada correctamente', data: notification };
    } catch (error) {
      throw new ErrorHandler('Ocurrió un error al actualizar la notificación', 500);
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
