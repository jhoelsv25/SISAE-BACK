// audit/interceptors/audit.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { DataSource } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private dataSource: DataSource,
    private reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const method = request.method;

    return next.handle().pipe(
      tap(async response => {
        // Puedes personalizar esto según el tipo de acción
        const action =
          method === 'POST'
            ? 'CREATE'
            : method === 'PUT'
              ? 'UPDATE'
              : method === 'DELETE'
                ? 'DELETE'
                : null;

        if (!action || !user) return;

        const entityName = context.getHandler().name;

        const auditRepo = this.dataSource.getRepository(AuditLog);

        await auditRepo.save(
          auditRepo.create({
            userId: user.id,
            entity: entityName,
            entityId: response?.id || null,
            before: {}, // si es update, puedes inyectar esto antes del cambio
            after: response,
            action,
            description: `${user.username} realizó ${action} sobre ${entityName}`,
          }),
        );
      }),
    );
  }
}
