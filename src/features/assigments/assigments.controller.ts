import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AssigmentsService } from './assigments.service';
import { CreateAssigmentDto } from './dto/create-assigment.dto';
import { UpdateAssigmentDto } from './dto/update-assigment.dto';

@Controller('assigments')
export class AssigmentsController {
  constructor(private readonly assigmentsService: AssigmentsService) {}

  @Post()
  create(@Body() dto: CreateAssigmentDto) {
    return this.assigmentsService.create(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.assigmentsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assigmentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAssigmentDto) {
    return this.assigmentsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assigmentsService.remove(id);
  }
}
