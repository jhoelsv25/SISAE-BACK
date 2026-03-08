import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExcelModule } from '@common/excel/excel.module';
import { InstitutionEntity } from '@features/institution/entities/institution.entity';
import { PersonEntity } from '@features/persons/entities/person.entity';
import { RedisModule } from '../../infrastruture/redis/redis.module';
import { QUEUE } from '../../infrastruture/queues';
import { StudentEntity } from './entities/student.entity';
import { StudentsController } from './students.controller';
import { StudentsImportProcessor } from './students-import.processor';
import { StudentsImportService } from './students-import.service';
import { StudentsService } from './students.service';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService, StudentsImportService, StudentsImportProcessor],
  imports: [
    TypeOrmModule.forFeature([StudentEntity, PersonEntity, InstitutionEntity]),
    BullModule.registerQueue({ name: QUEUE.STUDENTS_IMPORT }),
    RedisModule,
    ExcelModule,
  ],
})
export class StudentsModule {}
