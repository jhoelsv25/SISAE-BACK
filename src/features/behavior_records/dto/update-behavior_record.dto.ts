import { PartialType } from '@nestjs/swagger';
import { CreateBehaviorRecordDto } from './create-behavior_record.dto';

export class UpdateBehaviorRecordDto extends PartialType(CreateBehaviorRecordDto) {}
