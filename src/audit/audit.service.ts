import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../common/exceptions';
import { AuditLog } from './entities/audit-log.entity';

import { GetAuditLogsDto } from './dto/get-audit-logs.dto';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async getCursorPage(query: GetAuditLogsDto) {
    try {
      const { limit = 50, cursor, entity, action, search } = query;

      // Decode cursor if exists
      let cursorDate = null;
      let cursorId = null;

      if (cursor) {
        try {
          const decoded = JSON.parse(Buffer.from(cursor, 'base64').toString('utf8'));
          cursorDate = decoded.date;
          cursorId = decoded.id;
        } catch (e) {
          console.error('Invalid cursor format:', e.message);
        }
      }

      const cleanParam = (val: any) =>
        (val === '' || val === 'null' || val === 'undefined' || val === null) ? null : val;

      const params = {
        limit: Number(limit),
        cursorDate: cleanParam(cursorDate),
        cursorId: cleanParam(cursorId),
        entity: cleanParam(entity),
        action: cleanParam(action),
        search: cleanParam(search),
      };

      const result = await this.auditLogRepository.query(
        'SELECT get_audit_logs_cursor($1) as result',
        [JSON.stringify(params)],
      );

      const dbResult = result[0].result;

      if (dbResult.nextCursor) {
        dbResult.nextCursor = Buffer.from(JSON.stringify(dbResult.nextCursor)).toString('base64');
      }

      return dbResult;
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }


  async findOne(id: string) {
    try {
      return await this.auditLogRepository.findOne({ where: { id } });
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async findByEntity(entity: string, page: number = 1, limit: number = 10) {
    try {
      const [logs, total] = await this.auditLogRepository.findAndCount({
        where: { entity },
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        data: logs,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }

  async findByUser(userId: string, page: number = 1, limit: number = 10) {
    try {
      const [logs, total] = await this.auditLogRepository.findAndCount({
        where: { userId },
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        data: logs,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new ErrorHandler(error.message, error.status);
    }
  }
}
