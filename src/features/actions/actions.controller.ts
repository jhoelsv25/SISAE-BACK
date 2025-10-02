import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AutoPermission } from '../../auth/decorators/auto-permission.decorator';
import { AdminRoles, OnlySuperAdmin } from '../../auth/decorators/common-roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { FilterBaseDto } from '../../common/dtos/filter-base.dto';
import { ActionsService } from './actions.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@ApiTags('actions')
@ApiBearerAuth()
@Controller('actions')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Post()
  @AdminRoles()
  async create(@Body() dto: CreateActionDto) {
    return await this.actionsService.create(dto);
  }

  @Get()
  @AutoPermission('read')
  async findAll(@Query() filter: FilterBaseDto) {
    return await this.actionsService.findAll(filter);
  }

  @Get(':id')
  @AutoPermission('read')
  async findOne(@Param('id') id: string) {
    return await this.actionsService.findOne(id);
  }

  @Patch(':id')
  @AdminRoles()
  async update(@Param('id') id: string, @Body() dto: UpdateActionDto) {
    return await this.actionsService.update(id, dto);
  }

  @Delete(':id')
  @OnlySuperAdmin()
  async remove(@Param('id') id: string) {
    return await this.actionsService.remove(id);
  }
}
