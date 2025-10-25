import { BaseEntity } from '@common/entities/base.entity';
import { ChatMessageType } from '@features/chat_messages/enums/chat_message.enum';
import { ChatRoomEntity } from '@features/chat_rooms/entities/chat_room.entity';
import { UserEntity } from '@features/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'chat_messages' })
export class ChatMessageEntity extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: ChatMessageType })
  type: ChatMessageType;

  @Column({ type: 'text' })
  fileUrl: string;

  @Column({ type: 'text' })
  fileName: string;

  @Column({ type: 'float' })
  fileSizeMB: number;

  @Column({ type: 'boolean', default: false })
  isEdited: boolean;

  @ManyToOne(() => ChatMessageEntity)
  replyTo: ChatMessageEntity;

  @ManyToOne(() => ChatRoomEntity)
  chatRoom: ChatRoomEntity;

  @ManyToOne(() => UserEntity)
  user: UserEntity;
}
