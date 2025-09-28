import { Injectable } from '@nestjs/common';
import { CreateModuleDto } from '../dto/create-module.dto';
import { FilterModuleDto } from '../dto/filter-module.dto';
import { UpdateModuleDto } from '../dto/update-module.dto';
import { CreateModuleUseCase } from '../use-cases/create-module.use-case';
import { GetModuleByIdUseCase } from '../use-cases/get-by-id-module.use-case';
import { GetModulesUseCase } from '../use-cases/get-modules.use-case';
import { RemoveModuleUseCase } from '../use-cases/remove-module.use-case';
import { UpdateModuleUseCase } from '../use-cases/update.module.use-case';

@Injectable()
export class ModulesService {
  constructor(
    private readonly createUseCase: CreateModuleUseCase,
    private readonly updateUseCase: UpdateModuleUseCase,
    private readonly removeUseCase: RemoveModuleUseCase,
    private readonly getAllUseCase: GetModulesUseCase,
    private readonly getByIdUseCase: GetModuleByIdUseCase,
  ) {}

  async create(dto: CreateModuleDto) {
    return await this.createUseCase.execute(dto);
  }

  async update(id: string, dto: UpdateModuleDto) {
    return await this.updateUseCase.execute(id, dto);
  }

  async remove(id: string) {
    return await this.removeUseCase.execute(id);
  }

  async getAll(filters?: FilterModuleDto) {
    return await this.getAllUseCase.execute(filters);
  }

  async getById(id: string) {
    return await this.getByIdUseCase.execute(id);
  }
}
