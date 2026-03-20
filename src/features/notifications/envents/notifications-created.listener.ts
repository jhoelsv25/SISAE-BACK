import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppGateway } from '../../../infrastruture/sockets/app.gatewat';

export interface NotificationCreatedEvent {
  id: string;
  title: string;
  content: string;
  isRead: boolean;
  linkUrl: string | null;
  sendAt: string;
  readAt: string | null;
  type: string;
  priority: string;
  recipientId: string;
  createdAt: string;
}

@Injectable()
export class NotificationsCreatedListener {
  private readonly logger = new Logger(NotificationsCreatedListener.name);

  constructor(private readonly appGateway: AppGateway) {}

  @OnEvent('notifications.created')
  handleCreated(payload: NotificationCreatedEvent) {
    this.appGateway.server.to(`user:${payload.recipientId}`).emit('notification:new', payload);
    this.logger.debug(`Realtime notification emitted for user ${payload.recipientId}`);
  }
}
