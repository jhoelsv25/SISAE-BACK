import { Injectable } from '@nestjs/common';
import { CreateAssigmentDto } from './dto/create-assigment.dto';
import { UpdateAssigmentDto } from './dto/update-assigment.dto';

@Injectable()
export class AssigmentsService {
  create(createAssigmentDto: CreateAssigmentDto) {
    return 'This action adds a new assigment';
  }

  findAll() {
    return `This action returns all assigments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assigment`;
  }

  update(id: number, updateAssigmentDto: UpdateAssigmentDto) {
    return `This action updates a #${id} assigment`;
  }

  remove(id: number) {
    return `This action removes a #${id} assigment`;
  }
}
