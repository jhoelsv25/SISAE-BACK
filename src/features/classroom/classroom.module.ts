import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssigmentEntity } from '../assigments/entities/assigment.entity';
import { ChatMessageEntity } from '../chat_messages/entities/chat_message.entity';
import { ChatRoomEntity } from '../chat_rooms/entities/chat_room.entity';
import { LearningMaterialEntity } from '../learning_materials/entities/learning_material.entity';
import { ClassroomUploadsController } from './classroom-uploads.controller';
import { ClassroomController } from './classroom.controller';
import { ClassroomGateway } from './classroom.gateway';
import { ClassroomService } from './classroom.service';
import { ClassroomCommentEntity } from './entities/classroom-comment.entity';
import { ClassroomPostEntity } from './entities/classroom-post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClassroomPostEntity,
      ClassroomCommentEntity,
      LearningMaterialEntity,
      AssigmentEntity,
      ChatMessageEntity,
      ChatRoomEntity,
    ]),
  ],
  controllers: [ClassroomController, ClassroomUploadsController],
  providers: [ClassroomService, ClassroomGateway],
  exports: [ClassroomService],
})
export class ClassroomModule {}
