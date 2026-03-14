import { DataSource } from 'typeorm';
import { PriorityType } from '@common/enums/global.enum';
import { NotificationEntity } from '@features/notifications/entities/notification.entity';
import { NotificationType } from '@features/notifications/enums/notification.enum';
import { UserEntity } from '@features/users/entities/user.entity';

export async function seedNotifications(dataSource: DataSource) {
  const notificationRepo = dataSource.getRepository(NotificationEntity);
  const userRepo = dataSource.getRepository(UserEntity);

  const users = await userRepo.find({ take: 5 });
  if (users.length === 0) {
    console.log('ℹ️  Saltando notificaciones: no hay usuarios');
    return;
  }

  const now = new Date();
  const items = [
    {
      title: 'Nueva tarea asignada',
      content: 'Se ha publicado la tarea "Ejercicios de números reales". Fecha límite: en 7 días.',
      type: NotificationType.INFO,
      priority: PriorityType.MEDIUM,
      linkUrl: '/courses/assignments',
    },
    {
      title: 'Calificación publicada',
      content: 'Tu calificación del Examen Bimestral 1 ya está disponible.',
      type: NotificationType.SUCCESS,
      priority: PriorityType.LOW,
      linkUrl: '/grades',
    },
    {
      title: 'Recordatorio: Reunión de padres',
      content: 'Mañana a las 16:00 en el auditorio. Asistencia obligatoria.',
      type: NotificationType.WARNING,
      priority: PriorityType.HIGH,
      linkUrl: '/announcements',
    },
  ];

  // sendAt/readAt son TIME WITH TIME ZONE (solo hora). Usamos current_time en raw INSERT.
  let created = 0;
  for (const user of users) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const existing = await notificationRepo.findOne({
        where: { recipientId: user.id, title: item.title },
      });
      if (existing) continue;
      await dataSource.query(
        `INSERT INTO notifications (title, content, is_read, link_url, send_at, read_at, type, priority, recipient_id)
         VALUES ($1, $2, $3, $4, current_time, ${i % 2 === 0 ? 'current_time' : 'NULL'}, $5, $6, $7)`,
        [
          item.title,
          item.content,
          i % 2 === 0,
          item.linkUrl ?? null,
          item.type,
          item.priority,
          user.id,
        ],
      );
      created += 1;
    }
  }
  console.log(`✅ Seed de notificaciones completado (${created} nuevos)`);
}
