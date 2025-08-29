import { Injectable } from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { User } from './entities/user.entity';
import { UserCrudService } from './services/user-crud.service';
import { UserPasswordService } from './services/user-password.service';

export type UserResponse = { message: string; data: Partial<User> };

@Injectable()
export class UsersService {
  constructor(
    private readonly crud: UserCrudService,
    private readonly userPasswordService: UserPasswordService,
  ) {}
  async changePassword(id: string, dto: ChangePasswordDto): Promise<void> {
    await this.userPasswordService.changePassword(id, dto);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    return this.crud.create(createUserDto);
  }

  async findAll(query: UserQueryDto) {
    return this.crud.findAll(query);
  }

  async findOne(id: string): Promise<User> {
    return this.crud.findOne(id);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.crud.findByUsername(username);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.crud.findByEmail(email);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    return await this.crud.update(id, updateUserDto);
  }

  async remove(id: string): Promise<UserResponse> {
    return this.crud.remove(id);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.crud.updateLastLogin(id);
  }

  async toggleActiveStatus(id: string): Promise<UserResponse> {
    return this.crud.toggleActiveStatus(id);
  }
}
