import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleEntity } from '../modules/entities/module.entity';
import { RoleEntity } from '../roles/entities/role.entity';
import { PermissionEntity } from './entities/permission.entity';
import { PermissionsController } from './permissions.controller';
import { PermissionReadRepository } from './repositories/permission-read.repository';
import { PermissionWriteRepository } from './repositories/permission-write.repository';
import { PermissionsService } from './services/permissions.service';
import {
  CreatePermissionUseCase,
  GetPermissionByIdUseCase,
  GetPermissionsUseCase,
  RemovePermissionUseCase,
  UpdatePermissionUseCase,
} from './use-cases';

const repositories = [PermissionReadRepository, PermissionWriteRepository];
const useCases = [
  CreatePermissionUseCase,
  UpdatePermissionUseCase,
  RemovePermissionUseCase,
  GetPermissionsUseCase,
  GetPermissionByIdUseCase,
];
@Module({
  imports: [TypeOrmModule.forFeature([PermissionEntity, ModuleEntity, RoleEntity])],
  controllers: [PermissionsController],
  providers: [PermissionsService, ...repositories, ...useCases],
  exports: [PermissionsService, TypeOrmModule],
})
export class PermissionsModule {}
