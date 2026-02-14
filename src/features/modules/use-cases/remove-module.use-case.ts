import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheService } from '../../../infrastruture/cache/cache.service';
import { ModuleReadRepository } from '../repositories/module-read.repository';

@Injectable()
export class RemoveModuleUseCase {
  constructor(
    private readonly readRepo: ModuleReadRepository,
    private readonly cache: CacheService,
  ) {}

  async execute(id: string) {
    const module = await this.readRepo.findOne(id);
    if (!module) throw new NotFoundException('Módulo no encontrado');
    if (module.children && module.children.length > 0) {
      throw new Error('No se puede eliminar un módulo con submódulos');
    }
    const result = await this.readRepo.remove(id);
    await this.cache.delPattern('modules:*');
    return result;
  }
}
