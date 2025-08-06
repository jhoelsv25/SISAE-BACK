import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';

export const corsConfig = (configService: ConfigService): CorsOptions => {
  return {
    origin: configService.get<string>('CORS_ORIGIN')?.split(',') || '*',
    methods: configService.get<string>('CORS_METHODS') || 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders:
      configService.get<string>('CORS_ALLOWED_HEADERS') || 'Content-Type, Accept, Authorization',
    credentials: configService.get<boolean>('CORS_CREDENTIALS') || true,
  };
};
