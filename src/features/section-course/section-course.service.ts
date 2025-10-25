import { Injectable } from '@nestjs/common';
import { CreateSectionCourseDto } from './dto/create-section-course.dto';
import { UpdateSectionCourseDto } from './dto/update-section-course.dto';

@Injectable()
export class SectionCourseService {
  create(createSectionCourseDto: CreateSectionCourseDto) {
    return 'This action adds a new sectionCourse';
  }

  findAll() {
    return `This action returns all sectionCourse`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sectionCourse`;
  }

  update(id: number, updateSectionCourseDto: UpdateSectionCourseDto) {
    return `This action updates a #${id} sectionCourse`;
  }

  remove(id: number) {
    return `This action removes a #${id} sectionCourse`;
  }
}
