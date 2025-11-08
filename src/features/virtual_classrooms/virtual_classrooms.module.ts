import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VirtualClassroomEntity } from './entities/virtual_classroom.entity';
import { VirtualClassroomsController } from './virtual_classrooms.controller';
import { VirtualClassroomsService } from './virtual_classrooms.service';

@Module({
  controllers: [VirtualClassroomsController],
  providers: [VirtualClassroomsService],
  imports: [TypeOrmModule.forFeature([VirtualClassroomEntity])],
})
export class VirtualClassroomsModule {}
