import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Verificar si ya existe un usuario con el mismo username
      const existingUser = await this.userRepository.findOne({
        where: { username: createUserDto.username },
      });

      if (existingUser) {
        throw new ErrorHandler('Usuario ya existe', 400);
      }

      // Verificar si ya existe un usuario con el mismo email (si se proporciona)
      if (createUserDto.email) {
        const existingEmail = await this.userRepository.findOne({
          where: { email: createUserDto.email },
        });

        if (existingEmail) {
          throw new ErrorHandler('Usuario con este email ya existe', 400);
        }
      }

      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const [users, total] = await this.userRepository.findAndCount({
        relations: ['role', 'profile'],
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        data: users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['role', 'profile'],
      });

      if (!user) {
        throw new ErrorHandler('Usuario no encontrado', 404);
      }

      return user;
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({
        where: { username },
        relations: ['role'],
        select: ['id', 'username', 'email', 'password', 'isActive', 'lastLogin'],
      });
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({
        where: { email },
        relations: ['role'],
      });
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.findOne(id);

      // Verificar duplicados solo si se están actualizando
      if (updateUserDto.username && updateUserDto.username !== user.username) {
        const existingUser = await this.userRepository.findOne({
          where: { username: updateUserDto.username },
        });

        if (existingUser) {
          throw new ErrorHandler('Usuario con este nombre ya existe', 400);
        }
      }

      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingEmail = await this.userRepository.findOne({
          where: { email: updateUserDto.email },
        });

        if (existingEmail) {
          throw new ErrorHandler('Usuario con este email ya existe', 400);
        }
      }

      Object.assign(user, updateUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const user = await this.findOne(id);

      // Verificar si el usuario puede ser eliminado (reglas de negocio)
      if (user.role.name === 'SuperAdmin') {
        throw new ErrorHandler('No se puede eliminar el usuario SuperAdmin', 403);
      }

      await this.userRepository.remove(user);
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    try {
      await this.userRepository.update(id, {
        lastLogin: new Date(),
      });
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async toggleActiveStatus(id: string): Promise<User> {
    try {
      const user = await this.findOne(id);
      user.isActive = !user.isActive;
      return await this.userRepository.save(user);
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }
}
