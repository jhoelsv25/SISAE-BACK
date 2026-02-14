import { Logger } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ClassroomService } from './classroom.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'classroom',
})
export class ClassroomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ClassroomGateway');

  constructor(private readonly classroomService: ClassroomService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    this.logger.log(`Client ${client.id} joined room: ${room}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string; userId: string; message: any },
  ) {
    // Save to DB
    if (data.userId && data.message?.content) {
      await this.classroomService.saveMessage(data.userId, data.room, data.message.content);
    }
    
    // Broadcast
    this.server.to(data.room).emit('newMessage', data.message);
  }

  @SubscribeMessage('newPost')
  handleNewPost(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string; post: any },
  ) {
    this.server.to(data.room).emit('feedUpdate', data.post);
  }
}
