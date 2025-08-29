import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = (configService: ConfigService): JwtModuleOptions => {
  console.log('JWT_SECRET:', configService.get<string>('JWT_SECRET'));
  const secret = configService.get<string>('JWT_SECRET');
  const expiresIn = configService.get<string>('JWT_EXPIRES_IN');
  console.log('[JWT CONFIG] JWT_SECRET:', secret);
  console.log('[JWT CONFIG] JWT_EXPIRES_IN:', expiresIn);
  return {
    global: true,
    secret,
    signOptions: { expiresIn },
  };
};
