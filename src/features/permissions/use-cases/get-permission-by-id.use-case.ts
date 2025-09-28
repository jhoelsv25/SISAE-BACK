import { Injectable } from '@nestjs/common';
import { PermissionReadRepository } from '../repositories/permission-read.repository';

@Injectable()
export class GetPermissionByIdUseCase {
  constructor(private readonly readRepo: PermissionReadRepository) {}

  async execute(id: string) {
    return this.readRepo.findOne(id);
  }
}
