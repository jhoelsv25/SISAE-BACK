import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AssessmentScoresService } from './assessment_scores.service';
import { CreateAssessmentScoreDto } from './dto/create-assessment_score.dto';
import { UpdateAssessmentScoreDto } from './dto/update-assessment_score.dto';

@Controller('assessment-scores')
export class AssessmentScoresController {
  constructor(private readonly assessmentScoresService: AssessmentScoresService) {}

  @Post()
  create(@Body() dto: CreateAssessmentScoreDto) {
    return this.assessmentScoresService.create(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.assessmentScoresService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assessmentScoresService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAssessmentScoreDto) {
    return this.assessmentScoresService.update(id, dto);
  }

  @Post('bulk')
  registerBulk(@Body() data: any) {
    return this.assessmentScoresService.registerBulk(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assessmentScoresService.remove(id);
  }
}
