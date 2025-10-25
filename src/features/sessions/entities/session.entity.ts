import { BaseEntity } from '@common/entities/base.entity';
import { UserEntity } from '@features/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'sessions' })
export class SessionEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  sessionToken: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'timestamp' })
  lastActive: Date;

  @Column({ type: 'varchar', length: 255 })
  userAgent: string;
  @Column({ type: 'varchar', length: 45 })
  ipAddress: string;

  isActive(): boolean {
    return this.expiresAt > new Date();
  }

  @ManyToOne(() => UserEntity)
  user: UserEntity;
}
