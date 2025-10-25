import { PartialType } from '@nestjs/swagger';
import { CreateLearningMaterialDto } from './create-learning_material.dto';

export class UpdateLearningMaterialDto extends PartialType(CreateLearningMaterialDto) {}
