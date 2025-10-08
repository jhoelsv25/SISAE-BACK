import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { DataSource } from 'typeorm';
import { getAuditUser } from '../context/audit.context';
import { AuditLog } from '../entities/audit-log.entity';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private dataSource: DataSource) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const entityName = context.getHandler().name;

    return next.handle().pipe(
      tap(async response => {
        const userId = getAuditUser();

        const action =
          method === 'POST'
            ? 'CREATE'
            : method === 'PUT'
              ? 'UPDATE'
              : method === 'DELETE'
                ? 'DELETE'
                : null;

        if (!action || !userId) return;

        try {
          const repo = this.dataSource.getRepository(AuditLog);
          await repo.save({
            userId,
            entity: entityName,
            entityId: response?.id || null,
            action,
            after: response,
            description: `El usuario ${userId} realizó ${action} sobre ${entityName}`,
          });
        } catch (err) {
          console.warn('Audit log failed:', err.message);
        }
      }),
    );
  }
}
