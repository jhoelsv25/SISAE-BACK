import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectAreaEntity } from './entities/subject_area.entity';
import { SubjectAreaController } from './subject_area.controller';
import { SubjectAreaService } from './subject_area.service';

@Module({
  controllers: [SubjectAreaController],
  providers: [SubjectAreaService],
  imports: [TypeOrmModule.forFeature([SubjectAreaEntity])],
})
export class SubjectAreaModule {}
