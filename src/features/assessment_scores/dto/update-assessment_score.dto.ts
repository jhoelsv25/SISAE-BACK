import { PartialType } from '@nestjs/swagger';
import { CreateAssessmentScoreDto } from './create-assessment_score.dto';

export class UpdateAssessmentScoreDto extends PartialType(CreateAssessmentScoreDto) {}
