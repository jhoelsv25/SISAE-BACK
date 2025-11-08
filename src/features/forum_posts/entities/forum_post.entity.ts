import { BaseEntity } from '@common/entities/base.entity';
import { ForumThreadEntity } from '@features/forum_threads/entities/forum_thread.entity';
import { UserEntity } from '@features/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'forum_posts' })
export class ForumPostEntity extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text' })
  attachmentUrl: string;

  @Column({ type: 'int', default: 0 })
  likes: number;

  @Column({ type: 'boolean', default: false })
  isSolution: boolean;

  @ManyToOne(() => ForumPostEntity)
  parentPost: ForumPostEntity;

  @ManyToOne(() => ForumThreadEntity)
  forumThread: ForumThreadEntity;

  @ManyToOne(() => UserEntity)
  user: UserEntity;
}
