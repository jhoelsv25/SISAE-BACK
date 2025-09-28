import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { PermissionWriteRepository } from '../repositories/permission-write.repository';

@Injectable()
export class CreatePermissionUseCase {
  constructor(private readonly writeRepo: PermissionWriteRepository) {}

  async execute(dto: CreatePermissionDto) {
    return this.writeRepo.create(dto);
  }
}
