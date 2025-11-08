import { PartialType } from '@nestjs/swagger';
import { CreateSubjectAreaDto } from './create-subject_area.dto';

export class UpdateSubjectAreaDto extends PartialType(CreateSubjectAreaDto) {}
