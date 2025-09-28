import { Injectable } from '@nestjs/common';
import { UpdateModuleDto } from '../dto/update-module.dto';
import { ModuleWriteRepository } from '../repositories/module.write.repository';

@Injectable()
export class UpdateModuleUseCase {
  constructor(private readonly writeRepo: ModuleWriteRepository) {}

  async execute(id: string, dto: UpdateModuleDto) {
    return await this.writeRepo.update(id, dto);
  }
}
