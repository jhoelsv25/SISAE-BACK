import {
  BadRequestException,
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/exceptions/http-exception.filter';
import { corsConfig } from './config/cors.config';
import { swaggerConfig } from './config/swagger.config';

async function bootstrap() {
  process.env.TZ = 'UTC';
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Verificar conexión a la DB
  try {
    const dataSource = app.get(DataSource);
    await dataSource.query('SELECT 1');
    logger.log('✅ Database connection successful!');
  } catch (error) {
    logger.error('❌ Database connection failed:', error.message);
    logger.warn('⚠️ Application will continue without database connection');
  }

  // Middlewares globales
  app.use(cookieParser());
  app.use(helmet({ contentSecurityPolicy: true }));
  app.use(compression());
  app.enableCors(corsConfig(configService));

  // Rate limiting por IP (100 requests/minuto)
  app.use(
    rateLimit({
      windowMs: 60 * 1000, // 1 minuto
      max: 100, // máximo 100 requests por IP
      message: {
        statusCode: 429,
        message: 'Demasiadas solicitudes. Intenta nuevamente más tarde.',
      },
    }),
  );

  // Prefijo global
  app.setGlobalPrefix('api');

  // Filtros y pipes globales
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
      exceptionFactory: errors => {
        const allMessages = errors
          .map(error => {
            if (!error.constraints) {
              return `${error.property} is invalid`;
            }
            return Object.values(error.constraints).join(', ');
          })
          .join(' | ');
        return new BadRequestException({
          message: allMessages,
          details: errors.map(error => ({
            property: error.property,
            value: error.value,
            constraints: error.constraints || {},
          })),
        });
      },
    }),
  );

  // Serialización global
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector, {
      strategy: 'exposeAll',
      enableImplicitConversion: true,
    }),
  );

  // Swagger
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  // Escuchar puerto
  const port = configService.get<number>('port') || 3000;
  await app.listen(port);

  logger.log('🎉 ================================');
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 Swagger docs available at: http://localhost:${port}/docs`);
  logger.log(`🔗 API base URL: http://localhost:${port}/api`);
  logger.log('🎉 ================================');
}

bootstrap().catch(error => {
  const logger = new Logger('Bootstrap');
  logger.error('💥 Application failed to start:', error);
  process.exit(1);
});
