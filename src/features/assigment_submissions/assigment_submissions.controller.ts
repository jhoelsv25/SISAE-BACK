import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssigmentSubmissionsService } from './assigment_submissions.service';
import { CreateAssigmentSubmissionDto } from './dto/create-assigment_submission.dto';
import { UpdateAssigmentSubmissionDto } from './dto/update-assigment_submission.dto';

@Controller('assigment-submissions')
export class AssigmentSubmissionsController {
  constructor(private readonly assigmentSubmissionsService: AssigmentSubmissionsService) {}

  @Post()
  create(@Body() createAssigmentSubmissionDto: CreateAssigmentSubmissionDto) {
    return this.assigmentSubmissionsService.create(createAssigmentSubmissionDto);
  }

  @Get()
  findAll() {
    return this.assigmentSubmissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assigmentSubmissionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssigmentSubmissionDto: UpdateAssigmentSubmissionDto) {
    return this.assigmentSubmissionsService.update(+id, updateAssigmentSubmissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assigmentSubmissionsService.remove(+id);
  }
}
