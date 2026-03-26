import { BaseEntity } from '@common/entities/base.entity';
import { AssigmentEntity } from '@features/assigments/entities/assigment.entity';
import { UserEntity } from '@features/users/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, Column } from 'typeorm';

@Entity({ name: 'task_comments' })
export class TaskCommentEntity extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => AssigmentEntity)
  @JoinColumn({ name: 'assigment_id' })
  assigment: AssigmentEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
