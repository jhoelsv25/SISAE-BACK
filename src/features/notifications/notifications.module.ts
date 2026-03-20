import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentEntity } from '@features/enrollments/entities/enrollment.entity';
import { GuardianEntity } from '@features/guardians/entities/guardian.entity';
import { SectionCourseEntity } from '@features/section-course/entities/section-course.entity';
import { StudentGuardianEntity } from '@features/student_guardians/entities/student_guardian.entity';
import { StudentEntity } from '@features/students/entities/student.entity';
import { TeacherEntity } from '@features/teachers/entities/teacher.entity';
import { QUEUE } from '../../infrastruture/queues';
import { NotificationRecipientEntity } from './entities/notification-recipient.entity';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationsCreatedListener } from './envents/notifications-created.listener';
import { NotificationsDomainListener } from './envents/notifications-domain.listener';
import { NotificationAudienceService } from './notification-audience.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsProcessor } from './notifications.processor';
import { NotificationsService } from './notifications.service';

@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationsProcessor,
    NotificationsCreatedListener,
    NotificationsDomainListener,
    NotificationAudienceService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      NotificationEntity,
      NotificationRecipientEntity,
      TeacherEntity,
      StudentEntity,
      GuardianEntity,
      EnrollmentEntity,
      StudentGuardianEntity,
      SectionCourseEntity,
    ]),
    BullModule.registerQueue({ name: QUEUE.NOTIFICATIONS }),
  ],
  exports: [NotificationsService, NotificationAudienceService],
})
export class NotificationsModule {}
