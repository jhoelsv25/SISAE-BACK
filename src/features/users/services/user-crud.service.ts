import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ErrorHandler } from '../../../common/exceptions';
import { hashPassword } from '../../../common/utils/password.util';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserCrudService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly entityManager: EntityManager,
  ) {
    this.customRepo = new UserRepository(this.entityManager);
  }

  private readonly customRepo: UserRepository;
  // Ejemplo de uso del repositorio personalizado
  async findActiveUsers(): Promise<UserEntity[]> {
    return this.customRepo.findActiveUsers();
  }

  async findByRole(roleName: string): Promise<UserEntity[]> {
    return this.customRepo.findByRole(roleName);
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ message: string; data: Partial<UserEntity> }> {
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
      console.log('Creating user:', createUserDto);
      const user = this.userRepository.create({
        ...createUserDto,
        role: createUserDto.roleId ? { id: createUserDto.roleId } : undefined,
      });
      console.log('User entity created:', user);
      const { password, ...res } = await this.userRepository.save(user);
      return { message: 'El usuario ha sido creado exitosamente', data: res };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un errror inesperado, prueba ma');
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string; data: Partial<UserEntity> }> {
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
      throw new ErrorHandler('Ocurrio un errror inesperado, prueba ma');
    }
  }

  async findOne(id: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['role', 'role.permissions', 'role.permissions.module', 'profile'],
      });
      if (!user) throw new ErrorHandler('Usuario no encontrado', 404);
      return user;
    } catch (error) {
      throw new ErrorHandler('Ocurrio un errror inesperado, prueba ma');
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
      throw new ErrorHandler('Ocurrio un errror inesperado, prueba ma');
    }
  }

  async remove(id: string): Promise<{ message: string; data: Partial<UserEntity> }> {
    try {
      const user = await this.findOne(id);
      if (user?.role?.name === 'SuperAdmin')
        throw new ErrorHandler('No se puede eliminar el usuario SuperAdmin', 403);
      await this.userRepository.remove(user);
      return { message: 'El usuario ha sido eliminado exitosamente', data: { id } };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un errror inesperado, prueba más tarde');
    }
  }
  async findByUsername(username: string): Promise<UserEntity | null> {
    try {
      return await this.userRepository.findOne({
        where: { username },
        relations: ['role'],
        select: [
          'id',
          'username',
          'email',
          'password',
          'isActive',
          'lastLogin',
          'firstName',
          'lastName',
          'profilePicture',
        ],
      });
    } catch (error) {
      throw new ErrorHandler('Ocurrio un errror inesperado, prueba ma');
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    try {
      return await this.userRepository.findOne({ where: { email }, relations: ['role'] });
    } catch (error) {
      throw new ErrorHandler('Ocurrio un errror inesperado, prueba ma');
    }
  }

  async updateLastLogin(id: string): Promise<{ message: string; data: Partial<UserEntity> }> {
    try {
      await this.userRepository.update(id, { lastLogin: new Date() });
      return { message: 'Último acceso actualizado', data: { id } };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un errror inesperado, prueba ma');
    }
  }

  async toggleActiveStatus(id: string): Promise<{ message: string; data: Partial<UserEntity> }> {
    try {
      const user = await this.findOne(id);
      user.isActive = !user.isActive;
      const { password, ...rest } = await this.userRepository.save(user);
      return { message: 'Estado actualizado', data: rest };
    } catch (error) {
      throw new ErrorHandler('Ocurrio un errror inesperado, prueba ma');
    }
  }
}
