import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../common/exceptions';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Module as ModuleEntity } from './entities/module.entity';

@Injectable()
export class ModulesService {
  private readonly logger = new Logger(ModulesService.name);

  constructor(
    @InjectRepository(ModuleEntity)
    private modulesRepository: Repository<ModuleEntity>,
  ) {}

  async create(dto: CreateModuleDto) {
    try {
      const existingModule = await this.modulesRepository.findOne({
        where: { name: dto.name },
      });

      if (existingModule) {
        throw new ErrorHandler('Módulo ya existe', 400);
      }

      const module = this.modulesRepository.create(dto);
      const savedModule = await this.modulesRepository.save(module);
      return savedModule;
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async findAll(page: number = 1, size: number = 10) {
    try {
      this.logger.log(`Finding all modules with pagination: page=${page}, size=${size}`);

      const [data, total] = await this.modulesRepository
        .createQueryBuilder('module')
        .skip((page - 1) * size)
        .take(size)
        .getManyAndCount();

      return {
        data,
        page,
        size,
        total,
      };
    } catch (error) {
      throw new ErrorHandler('Error al obtener los módulos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    try {
      const module = await this.modulesRepository.findOneBy({ id });
      return ErrorHandler.validateExists(module, 'Módulo', id);
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async update(id: string, updateModuleDto: UpdateModuleDto) {
    try {
      await this.findOne(id);

      if (updateModuleDto.name) {
        const existingModule = await this.modulesRepository.findOne({
          where: { name: updateModuleDto.name },
        });

        if (existingModule && existingModule.id !== id) {
          throw new ErrorHandler('Módulo con este nombre ya existe', 400);
        }
      }

      await this.modulesRepository.update(id, updateModuleDto);
      return await this.findOne(id);
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async remove(id: string) {
    try {
      const module = await this.findOne(id);
      if (module.children && module.children.length > 0) {
        throw new ErrorHandler('No se puede eliminar un módulo con submódulos', 400);
      }

      await this.modulesRepository.delete(id);
      return { message: 'Módulo eliminado correctamente' };
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }
}
