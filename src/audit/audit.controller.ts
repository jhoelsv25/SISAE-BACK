import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@ApiTags('Audit')
@Controller('audit')
export class AuditController {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los logs de auditoría' })
  @ApiResponse({ status: 200, description: 'Lista de logs de auditoría' })
  async findAll(
    @Query('limit') limit = 50,
    @Query('offset') offset = 0,
    @Query('entity') entity?: string,
    @Query('action') action?: string,
  ) {
    const query = this.auditRepository.createQueryBuilder('audit');

    if (entity) {
      query.andWhere('audit.entity = :entity', { entity });
    }

    if (action) {
      query.andWhere('audit.action = :action', { action });
    }

    query.orderBy('audit.createdAt', 'DESC').limit(limit).offset(offset);

    const [logs, total] = await query.getManyAndCount();

    return {
      logs,
      total,
      limit,
      offset,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un log de auditoría por ID' })
  @ApiResponse({ status: 200, description: 'Log de auditoría encontrado' })
  async findOne(@Param('id') id: string) {
    return await this.auditRepository.findOne({ where: { id } });
  }
}
