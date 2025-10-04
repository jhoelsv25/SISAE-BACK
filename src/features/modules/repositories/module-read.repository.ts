import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../../../common/exceptions';
import { FilterModuleDto } from '../dto/filter-module.dto';
import { ModuleEntity } from '../entities/module.entity';

@Injectable()
export class ModuleReadRepository {
  constructor(
    @InjectRepository(ModuleEntity)
    private readonly repo: Repository<ModuleEntity>,
  ) {}

  async findAll(filters: FilterModuleDto) {
    try {
      const page = filters.page ?? 1;
      const size = filters.size ?? 20;

      const query = this.repo.createQueryBuilder('module').where('module.parent IS NULL');

      if (filters.search) {
        query.andWhere('LOWER(module.name) LIKE LOWER(:name)', { name: `%${filters.search}%` });
      }

      const [data, total] = await query
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
      const module = await this.repo.findOne({
        where: { id },
        relations: ['children'],
      });
      return ErrorHandler.validateExists(module, 'Módulo', id);
    } catch (error) {
      throw new ErrorHandler(
        'Ocurrio un error al obtener el módulo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const module = await this.findOne(id);

      if (module.children && module.children.length > 0) {
        throw new ErrorHandler(
          'No se puede eliminar un módulo con submódulos',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.repo.update(id, { deletedAt: new Date() });

      return { message: 'Módulo eliminado correctamente' };
    } catch (error) {
      throw new ErrorHandler(
        'Ocurrió un error al eliminar el módulo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
