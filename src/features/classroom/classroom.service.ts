import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { AssigmentEntity } from '../assigments/entities/assigment.entity';
import { ChatMessageEntity } from '../chat_messages/entities/chat_message.entity';
import { ChatRoomEntity } from '../chat_rooms/entities/chat_room.entity';
import { LearningMaterialEntity } from '../learning_materials/entities/learning_material.entity';
import { ClassroomPostEntity } from './entities/classroom-post.entity';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(ClassroomPostEntity)
    private readonly postRepo: Repository<ClassroomPostEntity>,
    @InjectRepository(LearningMaterialEntity)
    private readonly materialRepo: Repository<LearningMaterialEntity>,
    @InjectRepository(AssigmentEntity)
    private readonly assignmentRepo: Repository<AssigmentEntity>,
    @InjectRepository(ChatMessageEntity)
    private readonly chatRepo: Repository<ChatMessageEntity>,
    @InjectRepository(ChatRoomEntity)
    private readonly roomRepo: Repository<ChatRoomEntity>,
  ) {}

  async getFeed(sectionCourseId: string) {
    try {
      const posts = await this.postRepo.find({
        where: { sectionCourse: { id: sectionCourseId } },
        relations: ['user', 'user.person', 'comments', 'comments.user', 'comments.user.person'],
        order: { id: 'DESC' }, // Assuming BaseEntity has id and we use it for order if createdAt is tricky
      });

      const materials = await this.materialRepo.find({
        where: { sectionCourse: { id: sectionCourseId } },
        order: { id: 'DESC' },
      });

      const assignments = await this.assignmentRepo.find({
        where: { sectionCourse: { id: sectionCourseId } },
        order: { id: 'DESC' },
      });

      const feed = [
        ...posts.map(p => ({
          id: p.id,
          type: 'post',
          content: p.content,
          date: (p as any).createdAt || new Date(),
          attachmentUrl: p.attachmentUrl,
          author: { 
            name: p.user?.person ? `${p.user.person.firstName} ${p.user.person.lastName}` : p.user?.username, 
            role: 'Docente' 
          },
          comments: p.comments.map(c => ({
            id: c.id,
            content: c.content,
            date: (c as any).createdAt || new Date(),
            author: c.user?.person ? `${c.user.person.firstName} ${c.user.person.lastName}` : c.user?.username
          })),
          commentsCount: p.comments.length
        })),
        ...materials.map(m => ({
          id: m.id,
          type: 'material',
          title: m.title,
          content: m.description,
          date: (m as any).createdAt || new Date(),
          url: m.url,
          author: { name: 'Docente', role: 'Material' },
          commentsCount: 0
        })),
        ...assignments.map(a => ({
          id: a.id,
          type: 'assignment',
          title: a.title,
          content: a.description,
          date: (a as any).createdAt || new Date(),
          dueDate: a.dueDate,
          author: { name: 'Sistema', role: 'Tarea' },
          commentsCount: 0
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return { data: feed };
    } catch (error) {
      throw new ErrorHandler('Error al obtener feed: ' + error.message, 500);
    }
  }

  async publishPost(userId: string, sectionCourseId: string, content: string, attachmentUrl?: string) {
    try {
      const post = this.postRepo.create({
        content,
        attachmentUrl,
        user: { id: userId },
        sectionCourse: { id: sectionCourseId }
      });
      return await this.postRepo.save(post);
    } catch (error) {
      throw new ErrorHandler('Error al publicar post: ' + error.message, 500);
    }
  }

  async getChatHistory(sectionCourseId: string) {
    try {
      const room = await this.roomRepo.findOne({ where: { sectionCourse: { id: sectionCourseId } } });
      if (!room) return { data: [] };

      const messages = await this.chatRepo.find({
        where: { chatRoom: { id: room.id } },
        relations: ['user', 'user.person'],
        order: { id: 'ASC' },
        take: 50,
      });

      return {
        data: messages.map(m => ({
          id: m.id,
          content: m.content,
          senderName: m.user?.person ? `${m.user.person.firstName} ${m.user.person.lastName}` : m.user?.username,
          isMe: false, // Updated on frontend
          timestamp: (m as any).createdAt ? new Date((m as any).createdAt).toLocaleTimeString() : 'N/A',
        }))
      };
    } catch (error) {
      throw new ErrorHandler('Error al obtener chat: ' + error.message, 500);
    }
  }

  async saveMessage(userId: string, sectionCourseId: string, content: string) {
    try {
      let room = await this.roomRepo.findOne({ where: { sectionCourse: { id: sectionCourseId } } });
      if (!room) {
        room = this.roomRepo.create({ name: 'Class Chat', sectionCourse: { id: sectionCourseId } });
        room = await this.roomRepo.save(room);
      }

      const msg = this.chatRepo.create({
        content,
        user: { id: userId },
        chatRoom: { id: room.id },
        type: 'TEXT' as any // Assuming 'TEXT' is a valid enum value
      });
      return await this.chatRepo.save(msg);
    } catch (error) {
       console.error('Error saving chat message', error);
       return null;
    }
  }
}
