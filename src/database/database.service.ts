import { Injectable, Type } from '@nestjs/common';
import { DataSource, EntityManager, EntityTarget, Repository } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(private readonly dataSource: DataSource) {}

  getManager(): EntityManager {
    return this.dataSource.manager;
  }

  // Genérico para cualquier repositorio
  getRepository<T extends object>(entity: EntityTarget<T>): Repository<T> {
    return this.dataSource.getRepository(entity);
  }

  // Para repositorios personalizados
  getCustomRepository<T>(RepoClass: Type<T>, entity: any): T {
    return new RepoClass(this.dataSource.manager, entity);
  }

  async transaction<T>(runInTransaction: (manager: EntityManager) => Promise<T>): Promise<T> {
    return this.dataSource.transaction(runInTransaction);
  }
}
