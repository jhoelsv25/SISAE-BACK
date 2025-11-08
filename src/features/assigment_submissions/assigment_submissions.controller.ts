import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AssigmentSubmissionsService } from './assigment_submissions.service';
import { CreateAssigmentSubmissionDto } from './dto/create-assigment_submission.dto';
import { UpdateAssigmentSubmissionDto } from './dto/update-assigment_submission.dto';

@Controller('assigment-submissions')
export class AssigmentSubmissionsController {
  constructor(private readonly assigmentSubmissionsService: AssigmentSubmissionsService) {}

  @Post()
  create(@Body() dto: CreateAssigmentSubmissionDto) {
    return this.assigmentSubmissionsService.create(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.assigmentSubmissionsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assigmentSubmissionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAssigmentSubmissionDto) {
    return this.assigmentSubmissionsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assigmentSubmissionsService.remove(id);
  }
}
