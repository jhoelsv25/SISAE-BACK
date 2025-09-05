import { Logger } from '@nestjs/common';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  private readonly logger = new Logger(AuditSubscriber.name);

  constructor() {
    this.logger.log('AuditSubscriber initialized');
  }

  async afterInsert(event: InsertEvent<any>) {
    try {
      if (event.metadata.name === 'AuditLog') return; // Evitar auditoría recursiva

      const connection = event.manager.connection;
      if (!connection) {
        this.logger.warn('No connection available for audit logging');
        return;
      }

      const repo = connection.getRepository(AuditLog);
      await repo.save({
        userId: event.queryRunner?.data?.userId || null,
        entity: event.metadata.name,
        entityId: event.entity.id || null,
        before: null,
        after: event.entity,
        action: 'CREATE',
        description: `Se ha creado una nueva entidad de tipo ${event.metadata.name}`,
      });

      this.logger.log(`Audit log created for INSERT on ${event.metadata.name}`);
    } catch (error) {
      this.logger.error('Error creating audit log for INSERT:', error);
    }
  }

  async beforeUpdate(event: UpdateEvent<any>) {
    try {
      if (event.metadata.name === 'AuditLog') return; // Evitar auditoría recursiva

      const connection = event.manager.connection;
      if (!connection) {
        this.logger.warn('No connection available for audit logging');
        return;
      }

      const repo = connection.getRepository(AuditLog);
      const before = event.databaseEntity || event.entity;
      const after = event.entity;
      if (!before || !after) return;

      await repo.save({
        userId: event.queryRunner?.data?.userId || null,
        entity: event.metadata.name,
        entityId: before.id,
        before,
        after,
        action: 'UPDATE',
        description: `Se ha actualizado la entidad de tipo ${event.metadata.name} con ID ${event?.entity?.id}`,
      });

      this.logger.log(`Audit log created for UPDATE on ${event.metadata.name}`);
    } catch (error) {
      this.logger.error('Error creating audit log for UPDATE:', error);
    }
  }

  async beforeRemove(event: RemoveEvent<any>) {
    try {
      if (event.metadata.name === 'AuditLog') return; // Evitar auditoría recursiva

      const connection = event.manager.connection;
      if (!connection) {
        this.logger.warn('No connection available for audit logging');
        return;
      }

      const repo = connection.getRepository(AuditLog);
      const before = event.databaseEntity || event.entity;
      if (!before) return;

      await repo.save({
        userId: event.queryRunner?.data?.userId || null,
        entity: event.metadata.name,
        entityId: before.id,
        before,
        after: null,
        action: 'DELETE',
        description: `Se ha eliminado la entidad de tipo ${event.metadata.name} con ID ${before.id}`,
      });

      this.logger.log(`Audit log created for DELETE on ${event.metadata.name}`);
    } catch (error) {
      this.logger.error('Error creating audit log for DELETE:', error);
    }
  }
}
