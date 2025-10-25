import { BaseEntity } from '@common/entities/base.entity';
import { ChatParticipantRole } from '@features/chat_participants/enums/chat_participant.enum';
import { ChatRoomEntity } from '@features/chat_rooms/entities/chat_room.entity';
import { UserEntity } from '@features/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'chat_participants' })
export class ChatParticipantEntity extends BaseEntity {
  @Column({ type: 'timestamp' })
  joinDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastReadAt: Date;

  @Column({ type: 'boolean', default: false })
  isMuted: boolean;

  @Column({ type: 'enum', enum: ChatParticipantRole })
  role: ChatParticipantRole;

  @ManyToOne(() => ChatRoomEntity)
  chatRoom: ChatRoomEntity;

  @ManyToOne(() => UserEntity)
  user: UserEntity;
}
