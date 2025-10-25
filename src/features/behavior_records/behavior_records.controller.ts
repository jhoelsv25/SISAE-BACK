import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BehaviorRecordsService } from './behavior_records.service';
import { CreateBehaviorRecordDto } from './dto/create-behavior_record.dto';
import { UpdateBehaviorRecordDto } from './dto/update-behavior_record.dto';

@Controller('behavior-records')
export class BehaviorRecordsController {
  constructor(private readonly behaviorRecordsService: BehaviorRecordsService) {}

  @Post()
  create(@Body() createBehaviorRecordDto: CreateBehaviorRecordDto) {
    return this.behaviorRecordsService.create(createBehaviorRecordDto);
  }

  @Get()
  findAll() {
    return this.behaviorRecordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.behaviorRecordsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBehaviorRecordDto: UpdateBehaviorRecordDto) {
    return this.behaviorRecordsService.update(+id, updateBehaviorRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.behaviorRecordsService.remove(+id);
  }
}
