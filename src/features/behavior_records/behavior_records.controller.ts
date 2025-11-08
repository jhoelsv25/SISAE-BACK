import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BehaviorRecordsService } from './behavior_records.service';
import { CreateBehaviorRecordDto } from './dto/create-behavior_record.dto';
import { UpdateBehaviorRecordDto } from './dto/update-behavior_record.dto';

@Controller('behavior-records')
export class BehaviorRecordsController {
  constructor(private readonly behaviorRecordsService: BehaviorRecordsService) {}

  @Post()
  create(@Body() dto: CreateBehaviorRecordDto) {
    return this.behaviorRecordsService.create(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.behaviorRecordsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.behaviorRecordsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBehaviorRecordDto) {
    return this.behaviorRecordsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.behaviorRecordsService.remove(id);
  }
}
