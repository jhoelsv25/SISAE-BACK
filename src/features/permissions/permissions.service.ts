import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { Module } from '../modules/entities/module.entity';
import { Role } from '../roles/entities/role.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    try {
      const { name, action, moduleId } = createPermissionDto;
      const module = await this.moduleRepository.findOne({ where: { id: moduleId } });
      if (!module) throw new NotFoundException('Módulo no encontrado');
      const permission = this.permissionRepository.create({ name, action, module });
      return await this.permissionRepository.save(permission);
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async findAll() {
    try {
      return await this.permissionRepository.find({ relations: ['module'] });
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async findOne(id: string) {
    try {
      const permission = await this.permissionRepository.findOne({
        where: { id },
        relations: ['module'],
      });
      if (!permission) throw new NotFoundException('Permiso no encontrado');
      return permission;
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    try {
      const permission = await this.permissionRepository.findOne({
        where: { id },
        relations: ['module'],
      });
      if (!permission) throw new NotFoundException('Permiso no encontrado');
      if (updatePermissionDto.name) permission.name = updatePermissionDto.name;
      if (updatePermissionDto.action) permission.action = updatePermissionDto.action;
      if (updatePermissionDto.moduleId) {
        const module = await this.moduleRepository.findOne({
          where: { id: updatePermissionDto.moduleId },
        });
        if (!module) throw new NotFoundException('Módulo no encontrado');
        permission.module = module;
      }
      return await this.permissionRepository.save(permission);
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async remove(id: string) {
    try {
      const permission = await this.permissionRepository.findOne({ where: { id } });
      if (!permission) throw new NotFoundException('Permiso no encontrado');
      await this.permissionRepository.remove(permission);
      return { message: 'Permiso eliminado correctamente' };
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }
}
