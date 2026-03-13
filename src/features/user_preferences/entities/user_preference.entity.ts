import { BaseEntity } from '@common/entities/base.entity';
import { UserEntity } from '@features/users/entities/user.entity';
import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';

@Entity({ name: 'user_preferences' })
@Index('uq_user_preferences_user', ['user'], { unique: true })
export class UserPreferenceEntity extends BaseEntity {
  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  preferences: Record<string, any>;

  @OneToOne(() => UserEntity, { eager: true })
  @JoinColumn()
  user: UserEntity;
}
