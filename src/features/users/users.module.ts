import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserEntity } from './entities/user.entity';
import { UserReadRepository } from './repositories/user-read.repository';
import { UserWriteRepository } from './repositories/user-write.repository';
import { UserPasswordService } from './services/user-password.service';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { DeleteUserUseCase } from './use-cases/delete-user.use-case';
import { GetAllUsersUseCase } from './use-cases/get-all-users.use-case';
import { GetUserByEmailUseCase } from './use-cases/get-user-by-email.use-case';
import { GetUserByIdUseCase } from './use-cases/get-user-by-id.use-case';
import { GetUserByUsernameUseCase } from './use-cases/get-user-by-username.use-case';
import { ToggleUserStatusUseCase } from './use-cases/toggle-user-status.use-case';
import { UpdateLastLoginUseCase } from './use-cases/update-last-login.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.use-case';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    // Main Service
    UsersService,
    UserPasswordService,

    // Repositories
    UserReadRepository,
    UserWriteRepository,

    // Use Cases
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    ToggleUserStatusUseCase,
    GetUserByIdUseCase,
    GetAllUsersUseCase,
    GetUserByUsernameUseCase,
    GetUserByEmailUseCase,
    UpdateLastLoginUseCase,

    // Guards
    RolesGuard,
    PermissionsGuard,
  ],
  exports: [
    UsersService,
    UserPasswordService,
    UserReadRepository,
    UserWriteRepository,
    TypeOrmModule,
  ],
})
export class UsersModule {}
