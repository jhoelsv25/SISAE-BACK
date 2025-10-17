import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassroomsController } from './classrooms.controller';
import { ClassroomsService } from './classrooms.service';
import { ClassroomEntity } from './entities/classroom.entity';

@Module({
  controllers: [ClassroomsController],
  providers: [ClassroomsService],
  imports: [TypeOrmModule.forFeature([ClassroomEntity])],
})
export class ClassroomsModule {}
