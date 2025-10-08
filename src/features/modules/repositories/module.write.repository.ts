import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import { CreateModuleDto } from '../dto/create-module.dto';
import { UpdateModuleDto } from '../dto/update-module.dto';
import { ModuleEntity } from '../entities/module.entity';

@Injectable()
export class ModuleWriteRepository {
  constructor(
    @InjectRepository(ModuleEntity)
    private readonly repo: Repository<ModuleEntity>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Crear módulo padre con sus hijos recursivamente
   */
  async create(dto: CreateModuleDto): Promise<any> {
    return await this.dataSource.transaction(async manager => {
      const repo = manager.getRepository(ModuleEntity);

      // Validar key antes de crear
      if (dto.key) {
        const existing = await repo.findOne({ where: { key: dto.key } });
        if (existing) {
          throw new ConflictException(`Ya existe un módulo con el key '${dto.key}'`);
        }
      }

      const module = await this.createModuleRecursive(dto, repo);
      return {
        data: module,
        message: 'Módulo creado correctamente',
      };
    });
  }

  /**
   * Actualizar módulo con sus hijos recursivamente
   */
  async update(id: string, dto: UpdateModuleDto): Promise<any> {
    return await this.dataSource.transaction(async manager => {
      const repo = manager.getRepository(ModuleEntity);
      const module = await repo.findOne({
        where: { id },
        relations: ['children', 'parent'],
      });
      if (!module) throw new NotFoundException('Módulo no encontrado');

      // Validar key único solo contra otros registros
      if (dto.key && dto.key !== module.key) {
        const existingModule = await repo.findOne({
          where: { key: dto.key, id: Not(module.id) },
        });
        if (existingModule) {
          throw new ConflictException(`Ya existe un módulo con el key '${dto.key}'`);
        }
      }

      const { children, ...updateData } = dto;
      Object.assign(module, updateData);

      // Reconstruir path si cambia key o parent
      if (dto.key) {
        const parent = module.parent;
        module.path = parent?.path ? `${parent.path}/${module.key}` : module.key;
      }

      await repo.save(module);

      // Actualizar hijos recursivamente
      if (children) {
        await this.updateChildren(module, children, repo);
      }

      return {
        data: module,
        message: 'Módulo actualizado correctamente',
      };
    });
  }

  /**
   * Crear módulo recursivo
   */
  private async createModuleRecursive(
    dto: CreateModuleDto,
    repo: Repository<ModuleEntity>,
    parent?: ModuleEntity,
  ): Promise<ModuleEntity> {
    const module = repo.create({
      ...dto,
      parent: parent || null,
      path: parent?.path ? `${parent.path}/${dto.key}` : dto.key,
    });

    const savedModule = await repo.save(module);

    if (dto.children && dto.children.length > 0) {
      for (const childDto of dto.children) {
        await this.createModuleRecursive(childDto, repo, savedModule);
      }
    }

    return savedModule;
  }

  /**
   * Actualizar hijos recursivamente
   */
  private async updateChildren(
    parent: ModuleEntity,
    childrenDtos: CreateModuleDto[],
    repo: Repository<ModuleEntity>,
  ) {
    const existingChildren = parent.children || [];
    const dtoMap = new Map<string, CreateModuleDto>();
    childrenDtos.forEach(child => {
      if ((child as any).id) dtoMap.set((child as any).id, child);
    });

    // Eliminar hijos que ya no existen en el DTO
    for (const child of existingChildren) {
      if (!dtoMap.has(child.id)) {
        await repo.softRemove(child);
      }
    }

    // Crear o actualizar hijos
    for (const childDto of childrenDtos) {
      if ((childDto as any).id) {
        await this.updateModuleRecursive((childDto as any).id, childDto, repo, parent);
      } else {
        await this.createModuleRecursive(childDto, repo, parent);
      }
    }
  }

  /**
   * Actualizar módulo recursivamente
   */
  private async updateModuleRecursive(
    id: string,
    dto: UpdateModuleDto,
    repo: Repository<ModuleEntity>,
    parent?: ModuleEntity,
  ): Promise<ModuleEntity> {
    const module = await repo.findOne({ where: { id }, relations: ['children', 'parent'] });
    if (!module) throw new NotFoundException('Módulo hijo no encontrado');

    // Validar key único contra otros registros
    if (dto.key && dto.key !== module.key) {
      const existingChild = await repo.findOne({
        where: { key: dto.key, id: Not(module.id) },
      });
      if (existingChild) {
        throw new ConflictException(`Ya existe un módulo con el key '${dto.key}'`);
      }
    }

    Object.assign(module, dto);

    if (dto.key || parent) {
      const currentParent = parent || module.parent;
      module.path = currentParent?.path ? `${currentParent.path}/${module.key}` : module.key;
    }

    await repo.save(module);

    await this.updateChildren(module, dto.children || [], repo);

    return module;
  }
}
