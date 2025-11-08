import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [TypeOrmModule.forFeature([NotificationEntity])],
  exports: [NotificationsService],
})
export class NotificationsModule {}
