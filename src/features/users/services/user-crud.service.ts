import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ErrorHandler } from '../../../common/exceptions';
import { hashPassword } from '../../../common/utils/password.util';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserCrudService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {
    this.customRepo = new UserRepository(this.entityManager);
  }

  private readonly customRepo: UserRepository;
  // Ejemplo de uso del repositorio personalizado
  async findActiveUsers(): Promise<User[]> {
    return this.customRepo.findActiveUsers();
  }

  async findByRole(roleName: string): Promise<User[]> {
    return this.customRepo.findByRole(roleName);
  }

  async create(createUserDto: CreateUserDto): Promise<{ message: string; data: Partial<User> }> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { username: createUserDto.username },
      });
      if (existingUser) throw new ErrorHandler('Usuario ya existe', 400);
      if (createUserDto.email) {
        const existingEmail = await this.userRepository.findOne({
          where: { email: createUserDto.email },
        });
        if (existingEmail) throw new ErrorHandler('Usuario con este email ya existe', 400);
      }
      // Hashear la contraseña antes de guardar
      if (createUserDto.password) {
        createUserDto.password = await hashPassword(createUserDto.password);
      }
      const user = this.userRepository.create(createUserDto);
      const { password, ...res } = await this.userRepository.save(user);
      return { message: 'El usuario ha sido creado exitosamente', data: res };
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string; data: Partial<User> }> {
    try {
      const user = await this.findOne(id);
      if (updateUserDto.username && updateUserDto.username !== user.username) {
        const existingUser = await this.userRepository.findOne({
          where: { username: updateUserDto.username },
        });
        if (existingUser) throw new ErrorHandler('Usuario con este nombre ya existe', 400);
      }
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingEmail = await this.userRepository.findOne({
          where: { email: updateUserDto.email },
        });
        if (existingEmail) throw new ErrorHandler('Usuario con este email ya existe', 400);
      }
      const { password, ...dtoWithoutPassword } = updateUserDto as any;
      Object.assign(user, dtoWithoutPassword);
      const { password: pwd, ...rest } = await this.userRepository.save(user);
      return { message: 'El usuario ha sido actualizado exitosamente', data: rest };
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['role', 'role.permissions', 'role.permissions.module', 'profile'],
      });
      if (!user) throw new ErrorHandler('Usuario no encontrado', 404);
      return user;
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async findAll(params: { page?: number; size?: number; search?: string; isActive?: boolean }) {
    try {
      const { page = 1, size = 10, search = '', isActive } = params;
      const query = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect('user.profile', 'profile')
        .orderBy('user.createdAt', 'DESC');
      if (typeof isActive === 'boolean') {
        query.andWhere('user.isActive = :isActive', { isActive });
      }
      if (search) {
        query.andWhere('user.username ILIKE :search OR user.email ILIKE :search', {
          search: `%${search}%`,
        });
      }
      const [users, total] = await query
        .skip((page - 1) * size)
        .take(size)
        .getManyAndCount();
      return {
        data: users,
        page,
        size,
        total,
      };
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async remove(id: string): Promise<{ message: string; data: Partial<User> }> {
    try {
      const user = await this.findOne(id);
      if (user?.role?.name === 'SuperAdmin')
        throw new ErrorHandler('No se puede eliminar el usuario SuperAdmin', 403);
      await this.userRepository.remove(user);
      return { message: 'El usuario ha sido eliminado exitosamente', data: { id } };
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
      return await this.userRepository.findOne({ where: { email }, relations: ['role'] });
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async updateLastLogin(id: string): Promise<{ message: string; data: Partial<User> }> {
    try {
      await this.userRepository.update(id, { lastLogin: new Date() });
      return { message: 'Último acceso actualizado', data: { id } };
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async toggleActiveStatus(id: string): Promise<{ message: string; data: Partial<User> }> {
    try {
      const user = await this.findOne(id);
      user.isActive = !user.isActive;
      const { password, ...rest } = await this.userRepository.save(user);
      return { message: 'Estado actualizado', data: rest };
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }
}
