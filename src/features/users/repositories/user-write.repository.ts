import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../../common/exceptions';
import { hashPassword } from '../../../common/utils/password.util';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserWriteRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    try {
      // Hashear la contraseña antes de guardar
      if (dto.password) {
        dto.password = await hashPassword(dto.password);
      }

      const user = this.repo.create({
        ...dto,
        role: dto.role ? { id: dto.role } : undefined,
        person: dto.person ? { id: dto.person } : undefined,
      });

      return await this.repo.save(user);
    } catch (error) {
      throw new ErrorHandler(error.message, error.status || 500);
    }
  }

  async update(id: string, dto: UpdateUserDto, currentUser: UserEntity): Promise<UserEntity> {
    try {
      // Excluir password del DTO de actualización
      const { password, ...dtoWithoutPassword } = dto as any;

      // Actualizar solo los campos que vienen en el DTO
      Object.assign(currentUser, dtoWithoutPassword);

      // Si viene role, actualizar la relación
      if (dto.role) {
        currentUser.role = { id: dto.role } as any;
      }
      // Si viene person, actualizar la relación
      if (dto.person) {
        currentUser.person = { id: dto.person } as any;
      }

      return await this.repo.save(currentUser);
    } catch (error) {
      throw new ErrorHandler(error.message, error.status || 500);
    }
  }

  async remove(user: UserEntity): Promise<void> {
    try {
      await this.repo.remove(user);
    } catch (error) {
      throw new ErrorHandler(error.message, error.status || 500);
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    try {
      await this.repo.update(id, { lastLogin: new Date() });
    } catch (error) {
      throw new ErrorHandler(error.message, error.status || 500);
    }
  }

  async toggleActiveStatus(user: UserEntity): Promise<UserEntity> {
    try {
      user.isActive = !user.isActive;
      return await this.repo.save(user);
    } catch (error) {
      throw new ErrorHandler(error.message, error.status || 500);
    }
  }
}
