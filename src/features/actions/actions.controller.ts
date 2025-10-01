import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
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
  async findAll() {
    return await this.actionsService.findAll();
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
