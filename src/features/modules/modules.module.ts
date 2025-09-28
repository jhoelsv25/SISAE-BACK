import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleEntity } from './entities/module.entity';
import { ModulesController } from './modules.controller';
import { ModuleReadRepository } from './repositories/module-read.repository';
import { ModuleWriteRepository } from './repositories/module.write.repository';
import { ModulesService } from './services/modules.service';
import {
  CreateModuleUseCase,
  GetModuleByIdUseCase,
  GetModulesUseCase,
  RemoveModuleUseCase,
  UpdateModuleUseCase,
} from './use-cases';

const repositories = [ModuleReadRepository, ModuleWriteRepository];
const useCases = [
  CreateModuleUseCase,
  UpdateModuleUseCase,
  RemoveModuleUseCase,
  GetModulesUseCase,
  GetModuleByIdUseCase,
];

@Module({
  controllers: [ModulesController],
  providers: [ModulesService, ...repositories, ...useCases],
  imports: [TypeOrmModule.forFeature([ModuleEntity])],
})
export class ModulesModule {}
