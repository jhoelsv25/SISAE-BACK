import { Injectable } from '@nestjs/common';
import { CreateAssessmentScoreDto } from './dto/create-assessment_score.dto';
import { UpdateAssessmentScoreDto } from './dto/update-assessment_score.dto';

@Injectable()
export class AssessmentScoresService {
  create(createAssessmentScoreDto: CreateAssessmentScoreDto) {
    return 'This action adds a new assessmentScore';
  }

  findAll() {
    return `This action returns all assessmentScores`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assessmentScore`;
  }

  update(id: number, updateAssessmentScoreDto: UpdateAssessmentScoreDto) {
    return `This action updates a #${id} assessmentScore`;
  }

  remove(id: number) {
    return `This action removes a #${id} assessmentScore`;
  }
}
