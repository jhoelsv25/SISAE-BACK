import { Logger } from '@nestjs/common';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { getAuditUser } from '../context/audit.context';
import { AuditLog } from '../entities/audit-log.entity';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  private readonly logger = new Logger(AuditSubscriber.name);

  async afterInsert(event: InsertEvent<any>) {
    if (event.metadata.name === 'AuditLog') return;
    const userId = getAuditUser();

    try {
      await event.manager.getRepository(AuditLog).save({
        userId,
        entity: event.metadata.name,
        entityId: event.entity?.id,
        before: null,
        after: event.entity,
        action: 'CREATE',
        description: `Inserción en ${event.metadata.name}`,
      });
    } catch (err) {
      this.logger.warn('Audit insert failed:', err.message);
    }
  }

  async beforeUpdate(event: UpdateEvent<any>) {
    if (event.metadata.name === 'AuditLog') return;
    const userId = getAuditUser();

    try {
      await event.manager.getRepository(AuditLog).save({
        userId,
        entity: event.metadata.name,
        entityId: event.entity?.id,
        before: event.databaseEntity,
        after: event.entity,
        action: 'UPDATE',
        description: `Actualización en ${event.metadata.name}`,
      });
    } catch (err) {
      this.logger.warn('Audit update failed:', err.message);
    }
  }

  async beforeRemove(event: RemoveEvent<any>) {
    if (event.metadata.name === 'AuditLog') return;
    const userId = getAuditUser();

    try {
      await event.manager.getRepository(AuditLog).save({
        userId,
        entity: event.metadata.name,
        entityId: event.entity?.id,
        before: event.databaseEntity,
        after: null,
        action: 'DELETE',
        description: `Eliminación en ${event.metadata.name}`,
      });
    } catch (err) {
      this.logger.warn('Audit delete failed:', err.message);
    }
  }
}
