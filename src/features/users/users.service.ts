import { Injectable } from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { UserEntity } from './entities/user.entity';
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

export type UserResponse = { message: string; data: Partial<UserEntity> };

@Injectable()
export class UsersService {
  constructor(
    private readonly userPasswordService: UserPasswordService,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly toggleUserStatusUseCase: ToggleUserStatusUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly getUserByUsernameUseCase: GetUserByUsernameUseCase,
    private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
    private readonly updateLastLoginUseCase: UpdateLastLoginUseCase,
  ) {}

  // ==================== USE CASES ====================

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    return await this.createUserUseCase.execute(createUserDto);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    return await this.updateUserUseCase.execute(id, updateUserDto);
  }

  async remove(id: string): Promise<UserResponse> {
    return await this.deleteUserUseCase.execute(id);
  }

  async toggleActiveStatus(id: string): Promise<UserResponse> {
    return await this.toggleUserStatusUseCase.execute(id);
  }

  async changePassword(id: string, dto: ChangePasswordDto): Promise<void> {
    await this.userPasswordService.changePassword(id, dto);
  }

  async findAll(query: UserQueryDto) {
    return await this.getAllUsersUseCase.execute(query);
  }

  async findOne(id: string): Promise<UserEntity | null> {
    return await this.getUserByIdUseCase.execute(id);
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return await this.getUserByUsernameUseCase.execute(username);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.getUserByEmailUseCase.execute(email);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.updateLastLoginUseCase.execute(id);
  }
}
