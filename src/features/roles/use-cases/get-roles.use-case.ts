import { Injectable } from '@nestjs/common';
import { FilterRoleDto } from '../dto/filte-role.dto';
import { RoleReadRepository } from '../repositories/role-read.repository';

@Injectable()
export class GetRolesUseCase {
  constructor(private readonly readRepo: RoleReadRepository) {}

  execute(filters?: FilterRoleDto) {
    return this.readRepo.findAll(filters);
  }
}
