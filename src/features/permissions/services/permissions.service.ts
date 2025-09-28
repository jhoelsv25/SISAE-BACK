import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { FilterPermissionDto } from '../dto/filter-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { CreatePermissionUseCase } from '../use-cases/create-permission.use-case';
import { GetPermissionByIdUseCase } from '../use-cases/get-permission-by-id.use-case';
import { GetPermissionsUseCase } from '../use-cases/get-permissions.use-case';
import { RemovePermissionUseCase } from '../use-cases/remove-permission.use-case';
import { UpdatePermissionUseCase } from '../use-cases/update-permission.use-case';

@Injectable()
export class PermissionsService {
  constructor(
    private readonly createUseCase: CreatePermissionUseCase,
    private readonly updateUseCase: UpdatePermissionUseCase,
    private readonly removeUseCase: RemovePermissionUseCase,
    private readonly getAllUseCase: GetPermissionsUseCase,
    private readonly getByIdUseCase: GetPermissionByIdUseCase,
  ) {}

  async create(dto: CreatePermissionDto) {
    return await this.createUseCase.execute(dto);
  }

  async update(id: string, dto: UpdatePermissionDto) {
    return await this.updateUseCase.execute(id, dto);
  }

  async remove(id: string) {
    return await this.removeUseCase.execute(id);
  }

  async getAll(filters?: FilterPermissionDto) {
    return await this.getAllUseCase.execute(filters);
  }

  async getById(id: string) {
    return await this.getByIdUseCase.execute(id);
  }
}
