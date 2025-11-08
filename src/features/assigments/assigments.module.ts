import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssigmentsController } from './assigments.controller';
import { AssigmentsService } from './assigments.service';
import { AssigmentEntity } from './entities/assigment.entity';

@Module({
  controllers: [AssigmentsController],
  providers: [AssigmentsService],
  imports: [TypeOrmModule.forFeature([AssigmentEntity])],
})
export class AssigmentsModule {}
