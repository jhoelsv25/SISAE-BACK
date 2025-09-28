import { Injectable } from '@nestjs/common';
import { ModuleReadRepository } from '../repositories/module-read.repository';

@Injectable()
export class GetModuleByIdUseCase {
  constructor(private readonly readRepo: ModuleReadRepository) {}

  async execute(id: string) {
    return await this.readRepo.findOne(id);
  }
}
