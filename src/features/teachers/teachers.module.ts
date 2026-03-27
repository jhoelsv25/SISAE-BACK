import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonEntity } from '../persons/entities/person.entity';
import { TeacherCredentialEntity } from './entities/teacher-credential.entity';
import { TeacherEntity } from './entities/teacher.entity';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';

@Module({
  controllers: [TeachersController],
  providers: [TeachersService],
  imports: [TypeOrmModule.forFeature([TeacherEntity, PersonEntity, TeacherCredentialEntity])],
})
export class TeachersModule {}
