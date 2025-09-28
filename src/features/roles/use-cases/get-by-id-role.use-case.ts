import { Injectable } from '@nestjs/common';
import { RoleReadRepository } from '../repositories/role-read.repository';

@Injectable()
export class GetRoleByIdUseCase {
  constructor(private readonly readRepo: RoleReadRepository) {}

  execute(id: string) {
    return this.readRepo.findOne(id);
  }
}
