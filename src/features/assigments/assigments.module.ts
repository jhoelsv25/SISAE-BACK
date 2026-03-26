import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssigmentsController } from './assigments.controller';
import { AssigmentsService } from './assigments.service';
import { AssigmentEntity } from './entities/assigment.entity';
import { AssigmentQuestionEntity } from './entities/assigment_question.entity';
import { AssigmentQuestionOptionEntity } from './entities/assigment_question_option.entity';

@Module({
  controllers: [AssigmentsController],
  providers: [AssigmentsService],
  imports: [TypeOrmModule.forFeature([AssigmentEntity, AssigmentQuestionEntity, AssigmentQuestionOptionEntity])],
})
export class AssigmentsModule {}
