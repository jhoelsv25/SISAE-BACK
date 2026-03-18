import { Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger(AppGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  afterInit(server: Server) {
    // 🔐 MIDDLEWARE JWT SOCKET
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

        // Guardamos el user en el socket
        socket.data.user = payload;

        next();
      } catch (err) {
        next(new UnauthorizedException('Invalid token'));
      }
    });

    this.logger.log('Socket JWT middleware initialized');
  }

  handleConnection(socket: Socket) {
    const user = socket.data.user;
    this.logger.log(`🔌 Connected user ${user.sub} (${socket.id})`);

    // room personal por usuario
    socket.join(`user:${user.sub}`);
  }

  handleDisconnect(socket: Socket) {
    const user = socket.data.user;
    if (user) {
      this.logger.log(`❌ Disconnected user ${user.sub}`);
    }
  }
}
