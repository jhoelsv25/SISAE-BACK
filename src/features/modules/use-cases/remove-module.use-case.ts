import { Injectable, NotFoundException } from '@nestjs/common';
import { ModuleReadRepository } from '../repositories/module-read.repository';

@Injectable()
export class RemoveModuleUseCase {
  constructor(private readonly readRepo: ModuleReadRepository) {}

  async execute(id: string) {
    const module = await this.readRepo.findOne(id);
    if (!module) throw new NotFoundException('Módulo no encontrado');
    if (module.children && module.children.length > 0) {
      throw new Error('No se puede eliminar un módulo con submódulos');
    }

    return await this.readRepo.remove(id);
  }
}
