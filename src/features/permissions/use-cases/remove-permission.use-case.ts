import { Injectable } from '@nestjs/common';
import { PermissionWriteRepository } from '../repositories/permission-write.repository';

@Injectable()
export class RemovePermissionUseCase {
  constructor(private readonly writeRepo: PermissionWriteRepository) {}

  async execute(id: string) {
    return this.writeRepo.remove(id);
  }
}
