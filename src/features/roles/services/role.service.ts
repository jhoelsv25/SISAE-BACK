import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from '../dto/create-role.dto';
import { FilterRoleDto } from '../dto/filte-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import {
  CreateRoleUseCase,
  GetModulesAndPermissionsByRoleIdUseCase,
  GetRoleByIdUseCase,
  GetRolesUseCase,
  RemoveRoleUseCase,
  UpdateRoleUseCase,
} from '../use-cases';

@Injectable()
export class RoleService {
  constructor(
    private readonly getModulesAndPermissionsByRoleIdUseCase: GetModulesAndPermissionsByRoleIdUseCase,
    private readonly createUseCase: CreateRoleUseCase,
    private readonly updateUseCase: UpdateRoleUseCase,
    private readonly deleteUseCase: RemoveRoleUseCase,
    private readonly getAllUseCase: GetRolesUseCase,
    private readonly getByIdUseCase: GetRoleByIdUseCase,
  ) {}

  async create(dto: CreateRoleDto) {
    return await this.createUseCase.execute(dto);
  }

  async update(id: string, dto: UpdateRoleDto) {
    return await this.updateUseCase.execute(id, dto);
  }

  async remove(id: string) {
    return await this.deleteUseCase.execute(id);
  }

  async getAll(filters?: FilterRoleDto) {
    return await this.getAllUseCase.execute(filters);
  }

  async getById(id: string) {
    return await this.getByIdUseCase.execute(id);
  }

  async getModulesAndPermissionsByRoleId(id: string) {
    return await this.getModulesAndPermissionsByRoleIdUseCase.execute(id);
  }

  async getModuleByRoleIdPaginated(id: string, filter: FilterRoleDto) {
    return await this.getModulesAndPermissionsByRoleIdUseCase.executePaginated(id, filter);
  }
}
