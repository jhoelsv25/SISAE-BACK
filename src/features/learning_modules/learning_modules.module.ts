import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningModuleEntity } from './entities/learning_module.entity';
import { LearningModulesController } from './learning_modules.controller';
import { LearningModulesService } from './learning_modules.service';

@Module({
  controllers: [LearningModulesController],
  providers: [LearningModulesService],
  imports: [TypeOrmModule.forFeature([LearningModuleEntity])],
})
export class LearningModulesModule {}
