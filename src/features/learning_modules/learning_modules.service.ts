import { Injectable } from '@nestjs/common';
import { CreateLearningModuleDto } from './dto/create-learning_module.dto';
import { UpdateLearningModuleDto } from './dto/update-learning_module.dto';

@Injectable()
export class LearningModulesService {
  create(createLearningModuleDto: CreateLearningModuleDto) {
    return 'This action adds a new learningModule';
  }

  findAll() {
    return `This action returns all learningModules`;
  }

  findOne(id: number) {
    return `This action returns a #${id} learningModule`;
  }

  update(id: number, updateLearningModuleDto: UpdateLearningModuleDto) {
    return `This action updates a #${id} learningModule`;
  }

  remove(id: number) {
    return `This action removes a #${id} learningModule`;
  }
}
