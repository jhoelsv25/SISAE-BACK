import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuditService } from './audit.service';
import { GetAuditLogsDto } from './dto/get-audit-logs.dto';

@ApiTags('Audit')
@Controller('audit')
export class AuditController {
  constructor(
    private readonly auditService: AuditService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener logs de auditoría con paginación por cursor' })
  async findAll(@Query() query: GetAuditLogsDto) {
    return this.auditService.getCursorPage(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un log de auditoría por ID' })
  @ApiResponse({ status: 200, description: 'Log de auditoría encontrado' })
  async findOne(@Param('id') id: string) {
    return this.auditService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener logs de auditoría por usuario' })
  async findByUser(
    @Param('userId') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditService.findByUser(userId, Number(page) || 1, Number(limit) || 10);
  }
}
