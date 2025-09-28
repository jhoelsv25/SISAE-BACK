import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { runSeeds } from '.';
import { AppModule } from '../../app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  try {
    await runSeeds(dataSource);
    console.log('✅ Database seeding completed');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
