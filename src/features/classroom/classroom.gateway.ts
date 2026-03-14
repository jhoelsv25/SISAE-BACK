import { Logger, UnauthorizedException } from '@nestjs/common';
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
          socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];

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
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
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
    this.server.to(data.room).emit('feedUpdate', feedItem);
    return feedItem;
  }
}
