import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors.config';
import { swaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Verificar conexión a la base de datos
  try {
    const dataSource = app.get(DataSource);
    await dataSource.query('SELECT 1');
    logger.log('✅ Database connection successful!');
  } catch (error) {
    logger.error('❌ Database connection failed:', error.message);
    logger.error('🔧 Please check your database configuration and ensure the database is running');
    logger.error('💡 Try running: ./scripts/db-start.sh');

    // No terminar la aplicación, pero mostrar advertencia
    logger.warn('⚠️ Application will continue without database connection');
  }

  //CORS setup
  app.enableCors(corsConfig(configService));

  //prefix setup
  app.setGlobalPrefix('api');

  //pipe setup
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza un error si hay propiedades no definidas en el DTO
      transform: true, // Transforma los payloads a los tipos definidos en los DTOs
    }),
  );

  // Helmet setup
  app.use(
    helmet({
      contentSecurityPolicy: true, // Configura la política de seguridad de contenido
    }),
  );

  //swagger setup
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

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
