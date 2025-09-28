import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateModuleDto } from '../dto/create-module.dto';
import { UpdateModuleDto } from '../dto/update-module.dto';
import { ModuleEntity } from '../entities/module.entity';

@Injectable()
export class ModuleWriteRepository {
  constructor(
    @InjectRepository(ModuleEntity)
    private readonly repo: Repository<ModuleEntity>,
    private readonly dataSource: DataSource, // Para transacciones
  ) {}

  /**
   * Crear módulo padre con sus hijos recursivamente
   */
  async create(dto: CreateModuleDto): Promise<any> {
    return await this.dataSource.transaction(async manager => {
      const repo = manager.getRepository(ModuleEntity);
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
      const module = await repo.findOne({ where: { id }, relations: ['children'] });
      if (!module) throw new NotFoundException('Módulo no encontrado');

      // Actualizar módulo padre
      Object.assign(module, dto);
      await repo.save(module);

      // Manejo recursivo de hijos
      await this.updateChildren(module, dto.children || [], repo);

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
        // Actualizar hijo existente
        await this.updateModuleRecursive((childDto as any).id, childDto, repo);
      } else {
        // Crear nuevo hijo
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
  ): Promise<ModuleEntity> {
    const module = await repo.findOne({ where: { id }, relations: ['children'] });
    if (!module) throw new NotFoundException('Módulo hijo no encontrado');

    Object.assign(module, dto);
    await repo.save(module);

    // Actualizar hijos del módulo
    await this.updateChildren(module, dto.children || [], repo);

    return module;
  }
}
