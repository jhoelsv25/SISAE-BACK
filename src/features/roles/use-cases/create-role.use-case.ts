import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from '../dto/create-role.dto';
import { RoleWriteRepository } from '../repositories/role-write.repository';

@Injectable()
export class CreateRoleUseCase {
  constructor(private readonly writeRepo: RoleWriteRepository) {}

  execute(dto: CreateRoleDto) {
    return this.writeRepo.create(dto);
  }
}
