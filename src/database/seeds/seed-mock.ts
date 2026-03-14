/**
 * Ejecuta solo los seeds de datos mock (anuncios, evaluaciones, tareas, notificaciones, módulos).
 * Útil cuando ya tienes data académica y solo quieres poblar estas tablas.
 * Uso: npm run seed:mock
 */
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../../app.module';
import { seedAnnouncements } from './announcements-seed';
import { seedLearningModules } from './learning-modules-seed';
import { seedAssessments } from './assessments-seed';
import { seedAssigments } from './assigments-seed';
import { seedNotifications } from './notifications-seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  try {
    await seedLearningModules(dataSource);
    await seedAssessments(dataSource);
    await seedAssigments(dataSource);
    await seedAnnouncements(dataSource);
    await seedNotifications(dataSource);
    console.log('✅ Seed mock completado');
  } catch (error) {
    console.error('❌ Seed mock falló:', error);
    throw error;
  } finally {
    await app.close();
  }
}

bootstrap();
