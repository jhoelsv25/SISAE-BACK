import { Injectable } from '@nestjs/common';
import { CreateStudentGuardianDto } from './dto/create-student_guardian.dto';
import { UpdateStudentGuardianDto } from './dto/update-student_guardian.dto';

@Injectable()
export class StudentGuardiansService {
  create(createStudentGuardianDto: CreateStudentGuardianDto) {
    return 'This action adds a new studentGuardian';
  }

  findAll() {
    return `This action returns all studentGuardians`;
  }

  findOne(id: number) {
    return `This action returns a #${id} studentGuardian`;
  }

  update(id: number, updateStudentGuardianDto: UpdateStudentGuardianDto) {
    return `This action updates a #${id} studentGuardian`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentGuardian`;
  }
}
