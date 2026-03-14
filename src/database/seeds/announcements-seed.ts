import { DataSource } from 'typeorm';
import { PriorityType } from '@common/enums/global.enum';
import { AnnouncementEntity } from '@features/announcements/entities/announcement.entity';
import { AnnouncementStatus, RecipientType } from '@features/announcements/enums/announcement.enum';
import { UserEntity } from '@features/users/entities/user.entity';
import { GradeEntity } from '@features/grades/entities/grade.entity';

export async function seedAnnouncements(dataSource: DataSource) {
  const announcementRepo = dataSource.getRepository(AnnouncementEntity);
  const userRepo = dataSource.getRepository(UserEntity);
  const gradeRepo = dataSource.getRepository(GradeEntity);

  const [user] = await userRepo.find({ take: 1 });
  const [grade] = await gradeRepo.find({ take: 1, relations: [] });
  if (!user || !grade) {
    console.log('ℹ️  Saltando announcements: faltan usuario o nota (ejecutar demo-academic antes)');
    return;
  }

  const baseItems = [
    { title: 'Bienvenida al año escolar 2026', content: 'Estimada comunidad educativa, damos la bienvenida al nuevo año escolar.', recipient: RecipientType.ALL, priority: PriorityType.HIGH, status: AnnouncementStatus.PUBLISHED },
    { title: 'Reunión de padres', content: 'Se convoca a los padres de familia al auditorio el viernes a las 16:00.', recipient: RecipientType.STUDENTS, priority: PriorityType.MEDIUM, status: AnnouncementStatus.PUBLISHED },
    { title: 'Suspensión por feriado', content: 'El 28 de julio no habrá clases. Las actividades se reanudan el 29.', recipient: RecipientType.ALL, priority: PriorityType.URGENT, status: AnnouncementStatus.PUBLISHED },
  ];
  // Generar ~50 anuncios con títulos únicos
  const items: typeof baseItems = [];
  for (let i = 0; i < 50; i++) {
    const base = baseItems[i % baseItems.length];
    items.push({
      ...base,
      title: `${base.title} #${i + 1}`.slice(0, 150),
      content: `${base.content} Comunicado n° ${i + 1}.`,
    });
  }

  let created = 0;
  const now = new Date();
  const expireAt = new Date(now);
  expireAt.setMonth(expireAt.getMonth() + 1);

  for (const item of items) {
    const exists = await announcementRepo.findOne({ where: { title: item.title } });
    if (exists) continue;
    await announcementRepo.save(
      announcementRepo.create({
        ...item,
        publishedAt: now,
        expireAt,
        attachmentUrl: '',
        view: 0,
        user,
        grade,
      }),
    );
    created += 1;
  }
  console.log(`✅ Seed de anuncios completado (${created} nuevos)`);
}
