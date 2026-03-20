import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationAudienceService } from '@features/notifications/notification-audience.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AnnouncementEntity } from './entities/announcement.entity';
import { AnnouncementStatus } from './enums/announcement.enum';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(AnnouncementEntity)
    private readonly repo: Repository<AnnouncementEntity>,
    private readonly audienceService: NotificationAudienceService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private async resolveRecipientCount(
    recipient: AnnouncementEntity['recipient'],
    gradeId?: string | null,
    sectionId?: string | null,
    status?: AnnouncementEntity['status'],
  ) {
    if (status !== AnnouncementStatus.PUBLISHED) {
      return 0;
    }
    const recipientIds = await this.audienceService.getAudienceForAnnouncement(
      recipient,
      gradeId ?? undefined,
      sectionId ?? undefined,
    );
    return recipientIds.length;
  }

  private withRecipientCount(announcement: AnnouncementEntity) {
    return {
      ...announcement,
      recipientCount: announcement.resolvedRecipientCount ?? 0,
    };
  }

  private emitPublishedEvent(announcement: AnnouncementEntity) {
    this.eventEmitter.emit('announcements.published', {
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      recipient: announcement.recipient,
      priority: announcement.priority,
      status: announcement.status,
      gradeId: announcement.grade?.id ?? null,
      sectionId: announcement.section?.id ?? null,
    });
  }

  async create(dto: CreateAnnouncementDto, user?: { id?: string }) {
    try {
      const { user: dtoUser, grade, section, ...rest } = dto;
      const resolvedRecipientCount = await this.resolveRecipientCount(
        dto.recipient,
        dto.grade ?? null,
        dto.section ?? null,
        dto.status,
      );
      const announcement = this.repo.create({
        ...rest,
        resolvedRecipientCount,
        user: dtoUser || user?.id ? { id: dtoUser ?? user?.id } : undefined,
        grade: grade ? { id: grade } : undefined,
        section: section ? { id: section } : undefined,
      });
      await this.repo.save(announcement);
      if (announcement.status === AnnouncementStatus.PUBLISHED && announcement.publishedAt <= new Date()) {
        this.emitPublishedEvent(announcement);
      }
      return { message: 'Anuncio creado correctamente', data: this.withRecipientCount(announcement) };
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler('Ocurrió un error al crear el anuncio', 500);
    }
  }

  async findAll(filter: any) {
    try {
      const announcements = await this.repo.find({ where: filter, relations: ['section'] });
      return {
        message: 'Anuncios obtenidos correctamente',
        data: announcements.map(announcement => this.withRecipientCount(announcement)),
      };
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler('Ocurrió un error al obtener los anuncios', 500);
    }
  }

  async findOne(id: string) {
    try {
      const announcement = await this.repo.findOne({ where: { id }, relations: ['section'] });
      if (!announcement) {
        throw new ErrorHandler('Anuncio no encontrado', 404);
      }
      return { message: 'Anuncio obtenido correctamente', data: this.withRecipientCount(announcement) };
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler('Ocurrió un error al obtener el anuncio', 500);
    }
  }

  async update(id: string, dto: UpdateAnnouncementDto, user?: { id?: string }) {
    try {
      const announcement = await this.repo.findOne({ where: { id }, relations: ['section'] });
      if (!announcement) {
        throw new ErrorHandler('Anuncio no encontrado', 404);
      }
      const nextGradeId = dto.grade ?? announcement.grade?.id ?? null;
      const nextSectionId = dto.section ?? announcement.section?.id ?? null;
      const nextRecipient = dto.recipient ?? announcement.recipient;
      const nextStatus = dto.status ?? announcement.status;
      const resolvedRecipientCount = await this.resolveRecipientCount(
        nextRecipient,
        nextGradeId,
        nextSectionId,
        nextStatus,
      );
      this.repo.merge(announcement, {
        ...dto,
        resolvedRecipientCount,
        user: dto.user || user?.id ? { id: dto.user ?? user?.id } : undefined,
        grade: dto.grade ? { id: dto.grade } : undefined,
        section: dto.section ? { id: dto.section } : undefined,
      });
      await this.repo.save(announcement);
      if (announcement.status === AnnouncementStatus.PUBLISHED && announcement.publishedAt <= new Date()) {
        this.emitPublishedEvent(announcement);
      }
      return { message: 'Anuncio actualizado correctamente', data: this.withRecipientCount(announcement) };
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler('Ocurrió un error al actualizar el anuncio', 500);
    }
  }

  async remove(id: string) {
    try {
      const announcement = await this.repo.findOne({ where: { id } });
      if (!announcement) {
        throw new ErrorHandler('Anuncio no encontrado', 404);
      }
      await this.repo.remove(announcement);
      return { message: 'Anuncio eliminado correctamente', data: announcement };
    } catch (error) {
      if (error instanceof ErrorHandler) throw error;
      throw new ErrorHandler('Ocurrió un error al eliminar el anuncio', 500);
    }
  }

  async publishScheduledAnnouncements(): Promise<number> {
    try {
      const now = new Date();
      const announcements = await this.repo.find({
        where: { status: AnnouncementStatus.DRAFT },
        relations: ['section', 'grade'],
      });

      const due = announcements.filter(item => item.publishedAt && new Date(item.publishedAt) <= now);
      for (const announcement of due) {
        const resolvedRecipientCount = await this.resolveRecipientCount(
          announcement.recipient,
          announcement.grade?.id ?? null,
          announcement.section?.id ?? null,
          AnnouncementStatus.PUBLISHED,
        );
        announcement.status = AnnouncementStatus.PUBLISHED;
        announcement.resolvedRecipientCount = resolvedRecipientCount;
        await this.repo.save(announcement);
        this.emitPublishedEvent(announcement);
      }

      return due.length;
    } catch (error) {
      return 0;
    }
  }
}
