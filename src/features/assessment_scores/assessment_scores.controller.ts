import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssessmentScoresService } from './assessment_scores.service';
import { CreateAssessmentScoreDto } from './dto/create-assessment_score.dto';
import { UpdateAssessmentScoreDto } from './dto/update-assessment_score.dto';

@Controller('assessment-scores')
export class AssessmentScoresController {
  constructor(private readonly assessmentScoresService: AssessmentScoresService) {}

  @Post()
  create(@Body() createAssessmentScoreDto: CreateAssessmentScoreDto) {
    return this.assessmentScoresService.create(createAssessmentScoreDto);
  }

  @Get()
  findAll() {
    return this.assessmentScoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assessmentScoresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssessmentScoreDto: UpdateAssessmentScoreDto) {
    return this.assessmentScoresService.update(+id, updateAssessmentScoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assessmentScoresService.remove(+id);
  }
}
