import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../permissions/entities/permission.entity';
import { Role } from './entities/role.entity';
import { RolesController } from './roles.controller';
import { RoleService } from './services/role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  controllers: [RolesController],
  providers: [RoleService],
  exports: [RoleService, TypeOrmModule],
})
export class RolesModule {}
