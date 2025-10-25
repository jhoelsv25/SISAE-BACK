import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';
import { AnnouncementEntity } from './entities/announcement.entity';

@Module({
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService],
  imports: [TypeOrmModule.forFeature([AnnouncementEntity])],
})
export class AnnouncementsModule {}
