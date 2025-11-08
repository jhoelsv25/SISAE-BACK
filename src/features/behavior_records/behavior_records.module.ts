import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BehaviorRecordsController } from './behavior_records.controller';
import { BehaviorRecordsService } from './behavior_records.service';
import { BehaviorRecordEntity } from './entities/behavior_record.entity';

@Module({
  controllers: [BehaviorRecordsController],
  providers: [BehaviorRecordsService],
  imports: [TypeOrmModule.forFeature([BehaviorRecordEntity])],
})
export class BehaviorRecordsModule {}
