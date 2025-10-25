import { PartialType } from '@nestjs/swagger';
import { CreateSectionCourseDto } from './create-section-course.dto';

export class UpdateSectionCourseDto extends PartialType(CreateSectionCourseDto) {}
