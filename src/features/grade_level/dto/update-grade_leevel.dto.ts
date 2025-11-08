import { PartialType } from '@nestjs/swagger';
import { CreateGradeLevelDto } from './create-grade_leevel.dto';

export class UpdateGradeLevelDto extends PartialType(CreateGradeLevelDto) {}
