import { Injectable } from '@nestjs/common';
import { CreateVirtualClassroomDto } from './dto/create-virtual_classroom.dto';
import { UpdateVirtualClassroomDto } from './dto/update-virtual_classroom.dto';

@Injectable()
export class VirtualClassroomsService {
  create(createVirtualClassroomDto: CreateVirtualClassroomDto) {
    return 'This action adds a new virtualClassroom';
  }

  findAll() {
    return `This action returns all virtualClassrooms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} virtualClassroom`;
  }

  update(id: number, updateVirtualClassroomDto: UpdateVirtualClassroomDto) {
    return `This action updates a #${id} virtualClassroom`;
  }

  remove(id: number) {
    return `This action removes a #${id} virtualClassroom`;
  }
}
