import { Injectable } from '@nestjs/common';
import { CacheService } from '../../../infrastruture/cache/cache.service';
import { CreateModuleDto } from '../dto/create-module.dto';
import { ModuleWriteRepository } from '../repositories/module.write.repository';

@Injectable()
export class CreateModuleUseCase {
  constructor(
    private readonly writeRepo: ModuleWriteRepository,
    private readonly cache: CacheService,
  ) {}

  async execute(dto: CreateModuleDto) {
    const result = await this.writeRepo.create(dto);
    await this.cache.delPattern('modules:*');
    return result;
  }
}
