import { Injectable } from '@nestjs/common';
import { FilterRoleDto } from '../dto/filte-role.dto';
import { RoleReadRepository } from '../repositories/role-read.repository';

@Injectable()
export class GetModulesAndPermissionsByRoleIdUseCase {
  constructor(private readonly readRepo: RoleReadRepository) {}

  async execute(roleId: string) {
    return this.readRepo.getModulesAndPermissionsByRoleId(roleId);
  }

  async executePaginated(id: string, filter: FilterRoleDto) {
    return this.readRepo.getModuleByRoleIdPaginated(id, filter);
  }
}
