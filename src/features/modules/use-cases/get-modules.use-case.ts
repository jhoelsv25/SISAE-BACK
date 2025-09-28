import { Injectable } from '@nestjs/common';
import { FilterModuleDto } from '../dto/filter-module.dto';
import { ModuleReadRepository } from '../repositories/module-read.repository';

@Injectable()
export class GetModulesUseCase {
  constructor(private readonly readRepo: ModuleReadRepository) {}

  async execute(filters?: FilterModuleDto) {
    return await this.readRepo.findAll(filters);
  }
}
