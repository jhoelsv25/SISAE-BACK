import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterBaseDto } from '../../common/dtos/filter-base.dto';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { ActionEntity } from './entities/action.entity';

@Injectable()
export class ActionsService {
  constructor(
    @InjectRepository(ActionEntity)
    private readonly repo: Repository<ActionEntity>,
  ) {}

  async create(createActionDto: CreateActionDto) {
    try {
      const action = this.repo.create(createActionDto);
      const saved = await this.repo.save(action);
      return { data: saved, message: 'Acción creada exitosamente' };
    } catch (error) {
      throw error;
    }
  }

  async findAll(filter: FilterBaseDto) {
    try {
      const queryBuilder = this.repo.createQueryBuilder('action');

      if (filter.search) {
        queryBuilder.andWhere('action.name ILIKE :search', { search: `%${filter.search}%` });
      }

      if (filter.sortBy) {
        queryBuilder.orderBy(`action.${filter.sortBy}`, filter.sortOrder || 'ASC');
      }

      // Validar y convertir page y size a número seguro
      const page = Number(filter.page) || 1;
      const size = Number(filter.size) || 10;

      const [actions, total] = await queryBuilder
        .skip((page - 1) * size)
        .take(size)
        .getManyAndCount();

      return { data: actions, page, size, total };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const action = await this.repo.findOne({ where: { id } });
      if (!action) throw new NotFoundException('Acción no encontrada');
      return { data: action };
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateActionDto: UpdateActionDto) {
    try {
      const action = await this.repo.findOne({ where: { id } });
      if (!action) throw new NotFoundException('Acción no encontrada');
      Object.assign(action, updateActionDto);
      const saved = await this.repo.save(action);
      return { data: saved, message: 'Acción actualizada exitosamente' };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const action = await this.repo.findOne({ where: { id } });
      if (!action) throw new NotFoundException('Acción no encontrada');
      await this.repo.softRemove(action);
      return { data: null, message: 'Acción eliminada exitosamente' };
    } catch (error) {
      throw error;
    }
  }
}
