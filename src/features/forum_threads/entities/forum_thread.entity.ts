import { BaseEntity } from '@common/entities/base.entity';
import { ForumEntity } from '@features/forums/entities/forum.entity';
import { UserEntity } from '@features/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'forum_threads' })
export class ForumThreadEntity extends BaseEntity {
  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'boolean', default: true })
  isPinned: boolean;

  @Column({ type: 'int', default: 0 })
  replyCount: number;

  @Column({ type: 'boolean', default: false })
  isLocked: boolean;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => ForumEntity)
  forum: ForumEntity;
}
