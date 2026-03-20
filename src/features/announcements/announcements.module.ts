import { Module } from '@nestjs/common';
import { NotificationsModule } from '@features/notifications/notifications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementScheduler } from './announcement.scheduler';
import { AnnouncementsService } from './announcements.service';
import { AnnouncementEntity } from './entities/announcement.entity';

@Module({
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService, AnnouncementScheduler],
  imports: [TypeOrmModule.forFeature([AnnouncementEntity]), NotificationsModule],
})
export class AnnouncementsModule {}
