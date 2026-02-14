import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { JOBS, QUEUE } from '../../infrastruture/queues';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsService } from './notifications.service';

export interface SendNotificationJobPayload {
  notification: CreateNotificationDto;
}

@Processor(QUEUE.NOTIFICATIONS, { concurrency: 3 })
export class NotificationsProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(private readonly notificationsService: NotificationsService) {
    super();
  }

  async process(job: Job<SendNotificationJobPayload, unknown>): Promise<unknown> {
    switch (job.name) {
      case JOBS.SEND_NOTIFICATION:
        return this.handleSendNotification(job);
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
        return undefined;
    }
  }

  private async handleSendNotification(job: Job<SendNotificationJobPayload>): Promise<void> {
    const { notification } = job.data;
    try {
      await this.notificationsService.create(notification);
      this.logger.log(`Notification sent for recipient ${notification.recipientId}`);
    } catch (error) {
      this.logger.error(`Failed to send notification: ${error?.message}`, error?.stack);
      throw error;
    }
  }
}
