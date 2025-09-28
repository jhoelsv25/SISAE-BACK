import { Injectable } from '@nestjs/common';
import { RoleReadRepository } from '../repositories/role-read.repository';

@Injectable()
export class GetModulesAndPermissionsByRoleIdUseCase {
  constructor(private readonly readRepo: RoleReadRepository) {}

  async execute(roleId: string) {
    return this.readRepo.getModulesAndPermissionsByRoleId(roleId);
  }
}
