import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentEntity } from './entities/student.entity';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService],
  imports: [TypeOrmModule.forFeature([StudentEntity])],
})
export class StudentsModule {}
