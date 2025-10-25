import { Injectable } from '@nestjs/common';
import { CreateBehaviorRecordDto } from './dto/create-behavior_record.dto';
import { UpdateBehaviorRecordDto } from './dto/update-behavior_record.dto';

@Injectable()
export class BehaviorRecordsService {
  create(createBehaviorRecordDto: CreateBehaviorRecordDto) {
    return 'This action adds a new behaviorRecord';
  }

  findAll() {
    return `This action returns all behaviorRecords`;
  }

  findOne(id: number) {
    return `This action returns a #${id} behaviorRecord`;
  }

  update(id: number, updateBehaviorRecordDto: UpdateBehaviorRecordDto) {
    return `This action updates a #${id} behaviorRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} behaviorRecord`;
  }
}
