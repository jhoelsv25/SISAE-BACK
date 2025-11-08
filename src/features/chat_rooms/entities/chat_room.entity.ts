import { BaseEntity } from '@common/entities/base.entity';
import { ChatRoomType } from '@features/chat_rooms/enums/chat_room.enum';
import { SectionCourseEntity } from '@features/section-course/entities/section-course.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'chat_rooms' })
export class ChatRoomEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'enum', enum: ChatRoomType })
  type: ChatRoomType;
  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;
  @Column({ type: 'int', nullable: true })
  maxMembers?: number;
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => SectionCourseEntity)
  sectionCourse: SectionCourseEntity;
}
