import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssigmentSubmissionsController } from './assigment_submissions.controller';
import { AssigmentSubmissionsService } from './assigment_submissions.service';
import { AssigmentSubmissionEntity } from './entities/assigment_submission.entity';

@Module({
  controllers: [AssigmentSubmissionsController],
  providers: [AssigmentSubmissionsService],
  imports: [TypeOrmModule.forFeature([AssigmentSubmissionEntity])],
})
export class AssigmentSubmissionsModule {}
