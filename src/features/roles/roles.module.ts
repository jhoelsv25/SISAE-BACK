import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from '../permissions/entities/permission.entity';
import { RoleEntity } from './entities/role.entity';
import { RoleReadRepository } from './repositories/role-read.repository';
import { RoleWriteRepository } from './repositories/role-write.repository';
import { RolesController } from './roles.controller';
import { RoleService } from './services/role.service';
import {
  CreateRoleUseCase,
  GetRoleByIdUseCase,
  GetRolesUseCase,
  RemoveRoleUseCase,
  UpdateRoleUseCase,
} from './use-cases';

const repositories = [RoleWriteRepository, RoleReadRepository];
const useCases = [
  CreateRoleUseCase,
  UpdateRoleUseCase,
  RemoveRoleUseCase,
  GetRolesUseCase,
  GetRoleByIdUseCase,
];
@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, PermissionEntity])],
  controllers: [RolesController],
  providers: [RoleService, ...repositories, ...useCases],
  exports: [RoleService, TypeOrmModule],
})
export class RolesModule {}
