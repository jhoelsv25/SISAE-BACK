import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../common/exceptions';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const [logs, total] = await this.auditLogRepository.findAndCount({
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
