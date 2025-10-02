import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { FilterBaseDto } from '../../common/dtos/filter-base.dto';
import { ActionsService } from './actions.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Post()
  async create(@Body() dto: CreateActionDto) {
    return await this.actionsService.create(dto);
  }

  @Get()
  async findAll(@Query() filter: FilterBaseDto) {
    return await this.actionsService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.actionsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateActionDto) {
    return await this.actionsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.actionsService.remove(id);
  }
}
