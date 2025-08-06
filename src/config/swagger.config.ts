import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('SISAE API')
  .setDescription('API documentation for SISAE')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
