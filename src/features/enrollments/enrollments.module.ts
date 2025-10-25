import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentEntity } from './entities/enrollment.entity';

@Module({
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  imports: [TypeOrmModule.forFeature([EnrollmentEntity])],
})
export class EnrollmentsModule {}
