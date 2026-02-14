import { BaseEntity } from '@common/entities/base.entity';
import { SectionCourseEntity } from '@features/section-course/entities/section-course.entity';
import { UserEntity } from '@features/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ClassroomCommentEntity } from './classroom-comment.entity';

@Entity({ name: 'classroom_posts' })
export class ClassroomPostEntity extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  attachmentUrl?: string;

  @ManyToOne(() => SectionCourseEntity)
  sectionCourse: SectionCourseEntity;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @OneToMany(() => ClassroomCommentEntity, (comment) => comment.post)
  comments: ClassroomCommentEntity[];
}
