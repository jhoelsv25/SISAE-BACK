import { Injectable } from '@nestjs/common';
import { CreateAssigmentSubmissionDto } from './dto/create-assigment_submission.dto';
import { UpdateAssigmentSubmissionDto } from './dto/update-assigment_submission.dto';

@Injectable()
export class AssigmentSubmissionsService {
  create(createAssigmentSubmissionDto: CreateAssigmentSubmissionDto) {
    return 'This action adds a new assigmentSubmission';
  }

  findAll() {
    return `This action returns all assigmentSubmissions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assigmentSubmission`;
  }

  update(id: number, updateAssigmentSubmissionDto: UpdateAssigmentSubmissionDto) {
    return `This action updates a #${id} assigmentSubmission`;
  }

  remove(id: number) {
    return `This action removes a #${id} assigmentSubmission`;
  }
}
