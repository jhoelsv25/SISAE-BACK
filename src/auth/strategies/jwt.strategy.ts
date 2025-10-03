import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { PayloadAuth } from '../interfaces/payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    // Intenta obtener el secret desde la configuración estructurada primero
    let jwtSecret = configService.get<string>('jwt.secret');

    // Si no está en la configuración estructurada, intenta directamente desde env
    if (!jwtSecret) {
      jwtSecret = configService.get<string>('JWT_SECRET');
    }

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in configuration. Please check your .env file.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: PayloadAuth) {
    return await this.authService.validate(payload);
  }
}
