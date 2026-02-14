import { Injectable } from '@nestjs/common';
import { CacheService } from '../../../infrastruture/cache/cache.service';
import { UpdateModuleDto } from '../dto/update-module.dto';
import { ModuleWriteRepository } from '../repositories/module.write.repository';

@Injectable()
export class UpdateModuleUseCase {
  constructor(
    private readonly writeRepo: ModuleWriteRepository,
    private readonly cache: CacheService,
  ) {}

  async execute(id: string, dto: UpdateModuleDto) {
    const result = await this.writeRepo.update(id, dto);
    await this.cache.delPattern('modules:*');
    return result;
  }
}
