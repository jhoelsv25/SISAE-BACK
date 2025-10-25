import { Injectable } from '@nestjs/common';
import { CreateLearningMaterialDto } from './dto/create-learning_material.dto';
import { UpdateLearningMaterialDto } from './dto/update-learning_material.dto';

@Injectable()
export class LearningMaterialsService {
  create(createLearningMaterialDto: CreateLearningMaterialDto) {
    return 'This action adds a new learningMaterial';
  }

  findAll() {
    return `This action returns all learningMaterials`;
  }

  findOne(id: number) {
    return `This action returns a #${id} learningMaterial`;
  }

  update(id: number, updateLearningMaterialDto: UpdateLearningMaterialDto) {
    return `This action updates a #${id} learningMaterial`;
  }

  remove(id: number) {
    return `This action removes a #${id} learningMaterial`;
  }
}
