import { PriorityType } from '@common/enums/global.enum';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationType } from '../enums/notification.enum';
import { NotificationAudienceService } from '../notification-audience.service';
import { NotificationsService } from '../notifications.service';
import { AnnouncementStatus, RecipientType } from '../../announcements/enums/announcement.enum';
import { AssigmentStatus } from '../../assigments/enums/assigment.enum';

interface AnnouncementPublishedEvent {
  id: string;
  title: string;
  content: string;
  recipient: RecipientType;
  priority: PriorityType;
  status: AnnouncementStatus;
  gradeId?: string | null;
  sectionId?: string | null;
}

interface AssignmentPublishedEvent {
  id: string;
  title: string;
  description?: string | null;
  sectionCourseId: string;
  status: AssigmentStatus;
}

interface AssessmentCreatedEvent {
  id: string;
  name: string;
  description?: string | null;
  sectionCourseId: string;
}

interface BehaviorCreatedEvent {
  id: string;
  studentId: string;
  category: string;
  description: string;
  guardianNotified: boolean;
}

@Injectable()
export class NotificationsDomainListener {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly audienceService: NotificationAudienceService,
  ) {}

  @OnEvent('announcements.published')
  async onAnnouncementPublished(event: AnnouncementPublishedEvent) {
    if (event.status !== AnnouncementStatus.PUBLISHED) return;

    const recipientIds = await this.audienceService.getAudienceForAnnouncement(
      event.recipient,
      event.gradeId ?? undefined,
      event.sectionId ?? undefined,
    );
    if (recipientIds.length === 0) return;

    await this.notificationsService.queueSend({
      title: `Anuncio: ${event.title}`,
      content: event.content,
      isRead: false,
      linkUrl: `/communications/announcements`,
      sendAt: new Date(),
      type: NotificationType.INFO,
      priority: event.priority,
      recipientId: recipientIds[0],
      recipientIds,
    });
  }

  @OnEvent('assignments.published')
  async onAssignmentPublished(event: AssignmentPublishedEvent) {
    if (event.status !== AssigmentStatus.PUBLISHED) return;

    const [studentIds, guardianIds, teacherIds] = await Promise.all([
      this.audienceService.getStudentUserIdsBySectionCourse(event.sectionCourseId),
      this.audienceService.getGuardianUserIdsBySectionCourse(event.sectionCourseId),
      this.audienceService.getTeacherUserIdsBySectionCourse(event.sectionCourseId),
    ]);
    const recipientIds = [...new Set([...studentIds, ...guardianIds, ...teacherIds])];
    if (recipientIds.length === 0) return;

    await this.notificationsService.queueSend({
      title: `Nueva tarea: ${event.title}`,
      content: event.description || 'Se publicó una nueva tarea en tu aula virtual.',
      isRead: false,
      linkUrl: `/virtual-classroom/list`,
      sendAt: new Date(),
      type: NotificationType.INFO,
      priority: PriorityType.MEDIUM,
      recipientId: recipientIds[0],
      recipientIds,
    });
  }

  @OnEvent('assessments.created')
  async onAssessmentCreated(event: AssessmentCreatedEvent) {
    const [studentIds, guardianIds, teacherIds] = await Promise.all([
      this.audienceService.getStudentUserIdsBySectionCourse(event.sectionCourseId),
      this.audienceService.getGuardianUserIdsBySectionCourse(event.sectionCourseId),
      this.audienceService.getTeacherUserIdsBySectionCourse(event.sectionCourseId),
    ]);

    const recipients = [...new Set([...studentIds, ...guardianIds, ...teacherIds])];
    if (recipients.length === 0) return;

    await this.notificationsService.queueSend({
      title: `Nueva evaluación: ${event.name}`,
      content: event.description || 'Se registró una nueva evaluación.',
      isRead: false,
      linkUrl: `/assessments/list`,
      sendAt: new Date(),
      type: NotificationType.INFO,
      priority: PriorityType.MEDIUM,
      recipientId: recipients[0],
      recipientIds: recipients,
    });
  }

  @OnEvent('behavior.created')
  async onBehaviorCreated(event: BehaviorCreatedEvent) {
    const recipients = new Set<string>();

    if (event.guardianNotified) {
      const guardianIds = await this.audienceService.getGuardianUserIdsByStudent(event.studentId);
      guardianIds.forEach(id => recipients.add(id));
    }

    if (recipients.size === 0) return;

    await this.notificationsService.queueSend({
      title: `Observación de conducta: ${event.category}`,
      content: event.description,
      isRead: false,
      linkUrl: `/behavior/records`,
      sendAt: new Date(),
      type: NotificationType.WARNING,
      priority: PriorityType.HIGH,
      recipientId: [...recipients][0],
      recipientIds: [...recipients],
    });
  }
}
