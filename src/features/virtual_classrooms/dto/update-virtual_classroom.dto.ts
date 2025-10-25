import { PartialType } from '@nestjs/swagger';
import { CreateVirtualClassroomDto } from './create-virtual_classroom.dto';

export class UpdateVirtualClassroomDto extends PartialType(CreateVirtualClassroomDto) {}
