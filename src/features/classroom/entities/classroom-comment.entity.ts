import { BaseEntity } from '@common/entities/base.entity';
import { UserEntity } from '@features/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ClassroomPostEntity } from './classroom-post.entity';

@Entity({ name: 'classroom_comments' })
export class ClassroomCommentEntity extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => ClassroomPostEntity)
  post: ClassroomPostEntity;

  @ManyToOne(() => UserEntity)
  user: UserEntity;
}
