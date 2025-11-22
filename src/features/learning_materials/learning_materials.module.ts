import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningModuleEntity } from '../learning_modules/entities/learning_module.entity';
import { LearningMaterialEntity } from './entities/learning_material.entity';
import { LearningMaterialsController } from './learning_materials.controller';
import { LearningMaterialsService } from './learning_materials.service';

@Module({
  controllers: [LearningMaterialsController],
  providers: [LearningMaterialsService],
  imports: [TypeOrmModule.forFeature([LearningMaterialEntity, LearningModuleEntity])],
})
export class LearningMaterialsModule {}
