import { Injectable } from '@nestjs/common';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { PermissionWriteRepository } from '../repositories/permission-write.repository';

@Injectable()
export class UpdatePermissionUseCase {
  constructor(private readonly writeRepo: PermissionWriteRepository) {}

  async execute(id: string, dto: UpdatePermissionDto) {
    return this.writeRepo.update(id, dto);
  }
}
