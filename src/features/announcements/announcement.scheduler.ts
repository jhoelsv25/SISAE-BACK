import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AnnouncementsService } from './announcements.service';

@Injectable()
export class AnnouncementScheduler implements OnModuleInit {
  private readonly logger = new Logger(AnnouncementScheduler.name);

  constructor(private readonly announcementsService: AnnouncementsService) {}

  async onModuleInit(): Promise<void> {
    const updated = await this.announcementsService.publishScheduledAnnouncements();
    if (updated > 0) {
      this.logger.log(`Publicación inicial de anuncios programados: ${updated}`);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async publishScheduled(): Promise<void> {
    const updated = await this.announcementsService.publishScheduledAnnouncements();
    if (updated > 0) {
      this.logger.log(`Anuncios programados publicados automáticamente: ${updated}`);
    }
  }
}
