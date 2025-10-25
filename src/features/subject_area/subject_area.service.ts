import { Injectable } from '@nestjs/common';
import { CreateSubjectAreaDto } from './dto/create-subject_area.dto';
import { UpdateSubjectAreaDto } from './dto/update-subject_area.dto';

@Injectable()
export class SubjectAreaService {
  create(createSubjectAreaDto: CreateSubjectAreaDto) {
    return 'This action adds a new subjectArea';
  }

  findAll() {
    return `This action returns all subjectArea`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subjectArea`;
  }

  update(id: number, updateSubjectAreaDto: UpdateSubjectAreaDto) {
    return `This action updates a #${id} subjectArea`;
  }

  remove(id: number) {
    return `This action removes a #${id} subjectArea`;
  }
}
