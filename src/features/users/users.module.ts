import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserEntity } from './entities/user.entity';
import { UserCrudService } from './services/user-crud.service';
import { UserPasswordService } from './services/user-password.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService, UserCrudService, UserPasswordService, RolesGuard, PermissionsGuard],
  exports: [UsersService, TypeOrmModule, UserCrudService, UserPasswordService],
})
export class UsersModule {}
