import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../../common/exceptions';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserReadRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async findById(id: string): Promise<UserEntity> {
    try {
      const user = await this.repo.findOne({
        where: { id },
        relations: ['role', 'role.permissions', 'role.permissions.module', 'profile'],
      });
      if (!user) throw new NotFoundException('Usuario no encontrado');
      return user;
    } catch (error) {
      throw new ErrorHandler(error.message, error.status || 500);
    }
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    try {
      return await this.repo.findOne({
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
      throw new ErrorHandler(error.message, error.status || 500);
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    try {
      return await this.repo.findOne({
        where: { email },
        relations: ['role'],
      });
    } catch (error) {
      throw new ErrorHandler(error.message, error.status || 500);
    }
  }

  async findAll(params: { page?: number; size?: number; search?: string; isActive?: boolean }) {
    try {
      const { page = 1, size = 10, search = '', isActive } = params;

      const query = this.repo
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
      throw new ErrorHandler(error.message, error.status || 500);
    }
  }

  async findActiveUsers(): Promise<UserEntity[]> {
    try {
      return await this.repo.find({
        where: { isActive: true },
        relations: ['role', 'profile'],
      });
    } catch (error) {
      throw new ErrorHandler(error.message, error.status || 500);
    }
  }

  async findByRole(roleName: string): Promise<UserEntity[]> {
    try {
      return await this.repo
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .where('role.name = :roleName', { roleName })
        .getMany();
    } catch (error) {
      throw new ErrorHandler(error.message, error.status || 500);
    }
  }

  async existsByUsername(username: string): Promise<boolean> {
    try {
      const count = await this.repo.count({ where: { username } });
      return count > 0;
    } catch (error) {
      throw new ErrorHandler(error.message, error.status || 500);
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    try {
      const count = await this.repo.count({ where: { email } });
      return count > 0;
    } catch (error) {
      throw new ErrorHandler(error.message, error.status || 500);
    }
  }
}
