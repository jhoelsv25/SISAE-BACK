// audit/entities/audit-log.entity.ts
import { BaseEntity } from 'common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('audit_logs')
export class AuditLog extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @Column({ type: 'varchar', length: 255 })
  entity: string;

  @Column({ type: 'uuid' })
  entityId: string;

  @Column({ type: 'json', nullable: true })
  before: any;

  @Column({ type: 'json', nullable: true })
  after: any;

  @Column({ type: 'varchar', length: 20 })
  action: 'CREATE' | 'UPDATE' | 'DELETE';

  @Column({ type: 'varchar' })
  description: string;
}
