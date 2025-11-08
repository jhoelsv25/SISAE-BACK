import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningMaterialsController } from './learning_materials.controller';
import { LearningMaterialsService } from './learning_materials.service';

@Module({
  controllers: [LearningMaterialsController],
  providers: [LearningMaterialsService],
  imports: [TypeOrmModule.forFeature([])],
})
export class LearningMaterialsModule {}
