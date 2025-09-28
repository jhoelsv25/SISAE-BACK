import { Injectable } from '@nestjs/common';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RoleWriteRepository } from '../repositories/role-write.repository';

@Injectable()
export class UpdateRoleUseCase {
  constructor(private readonly writeRepo: RoleWriteRepository) {}

  execute(id: string, dto: UpdateRoleDto) {
    return this.writeRepo.update(id, dto);
  }
}
