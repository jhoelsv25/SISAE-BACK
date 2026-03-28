import { Logger, UnauthorizedException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ClassroomService } from './classroom.service';

function extractCookieToken(cookieHeader?: string): string | null {
  if (!cookieHeader) return null;
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(part => {
      const [key, ...rest] = part.trim().split('=');
      return [key, rest.join('=')];
    }),
  );
  return cookies['accessToken'] ?? null;
}

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'classroom',
})
export class ClassroomGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ClassroomGateway.name);

  constructor(
    private readonly classroomService: ClassroomService,
    private readonly jwtService: JwtService,
  ) {}

  afterInit(server: Server) {
    server.use((socket, next) => {
      try {
        const token =
          socket.handshake.auth?.token ||
          socket.handshake.headers?.authorization?.split(' ')[1] ||
          extractCookieToken(socket.handshake.headers?.cookie as string | undefined);

        if (!token) {
          return next(new UnauthorizedException('Missing token'));
        }

        const payload = this.jwtService.verify(token);
        socket.data.user = payload;
        next();
      } catch {
        next(new UnauthorizedException('Invalid token'));
      }
    });
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    await this.classroomService.getFeed(room, client.data.user?.sub);
    client.join(room);
    this.logger.log(`Client ${client.id} joined room: ${room}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string; message: { content: string } },
  ) {
    const userId = client.data.user?.sub;
    if (!userId || !data.room || !data.message?.content?.trim()) {
      throw new UnauthorizedException('Invalid message payload');
    }

    const saved = await this.classroomService.sendChatMessage(userId, data.room, data.message.content.trim());
    this.server.to(data.room).emit('newMessage', saved);
    await this.classroomService.emitChatInboxUpdates(data.room, userId);
    return saved;
  }

  @SubscribeMessage('newPost')
  async handleNewPost(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string; post: { content: string; attachmentUrl?: string } },
  ) {
    const userId = client.data.user?.sub;
    if (!userId || !data.room || (!data.post?.content?.trim() && !data.post?.attachmentUrl)) {
      throw new UnauthorizedException('Invalid post payload');
    }

    const created = await this.classroomService.publishPost(
      userId,
      data.room,
      data.post.content?.trim() ?? '',
      data.post.attachmentUrl,
    );
    const feedItem = await this.classroomService.getFeedItemByPostId(created.id);
    this.server.to(data.room).emit('feedCreated', feedItem);
    return feedItem;
  }

  @OnEvent('classroom.feed.created')
  handleFeedCreated(payload: { roomIds: string[]; item: unknown }) {
    for (const roomId of payload.roomIds) {
      this.server.to(roomId).emit('feedCreated', payload.item);
    }
  }

  @OnEvent('classroom.feed.updated')
  handleFeedUpdated(payload: { roomIds: string[]; item: unknown }) {
    for (const roomId of payload.roomIds) {
      this.server.to(roomId).emit('feedUpdated', payload.item);
    }
  }

  @OnEvent('classroom.feed.deleted')
  handleFeedDeleted(payload: { roomIds: string[]; id: string }) {
    for (const roomId of payload.roomIds) {
      this.server.to(roomId).emit('feedDeleted', { id: payload.id });
    }
  }

  @OnEvent('classroom.task.updated')
  handleTaskUpdated(payload: { roomIds: string[]; task: unknown }) {
    for (const roomId of payload.roomIds) {
      this.server.to(roomId).emit('taskUpdated', payload.task);
    }
  }

  @OnEvent('classroom.task.deleted')
  handleTaskDeleted(payload: { roomIds: string[]; id: string }) {
    for (const roomId of payload.roomIds) {
      this.server.to(roomId).emit('taskDeleted', { id: payload.id });
    }
  }
}
