import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssigmentsService } from './assigments.service';
import { CreateAssigmentDto } from './dto/create-assigment.dto';
import { UpdateAssigmentDto } from './dto/update-assigment.dto';

@Controller('assigments')
export class AssigmentsController {
  constructor(private readonly assigmentsService: AssigmentsService) {}

  @Post()
  create(@Body() createAssigmentDto: CreateAssigmentDto) {
    return this.assigmentsService.create(createAssigmentDto);
  }

  @Get()
  findAll() {
    return this.assigmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assigmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssigmentDto: UpdateAssigmentDto) {
    return this.assigmentsService.update(+id, updateAssigmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assigmentsService.remove(+id);
  }
}
