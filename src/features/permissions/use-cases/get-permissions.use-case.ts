import { Injectable } from '@nestjs/common';
import { FilterPermissionDto } from '../dto/filter-permission.dto';
import { PermissionReadRepository } from '../repositories/permission-read.repository';

@Injectable()
export class GetPermissionsUseCase {
  constructor(private readonly readRepo: PermissionReadRepository) {}

  async execute(filters?: FilterPermissionDto) {
    return this.readRepo.findAll(filters);
  }
}
