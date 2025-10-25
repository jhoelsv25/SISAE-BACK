import { PartialType } from '@nestjs/swagger';
import { CreateAssigmentDto } from './create-assigment.dto';

export class UpdateAssigmentDto extends PartialType(CreateAssigmentDto) {}
