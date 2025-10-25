import { PartialType } from '@nestjs/swagger';
import { CreateAssigmentSubmissionDto } from './create-assigment_submission.dto';

export class UpdateAssigmentSubmissionDto extends PartialType(CreateAssigmentSubmissionDto) {}
