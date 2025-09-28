import { Injectable } from '@nestjs/common';
import { CreateModuleDto } from '../dto/create-module.dto';
import { ModuleWriteRepository } from '../repositories/module.write.repository';

@Injectable()
export class CreateModuleUseCase {
  constructor(private readonly writeRepo: ModuleWriteRepository) {}

  async execute(dto: CreateModuleDto) {
    return await this.writeRepo.create(dto);
  }
}
