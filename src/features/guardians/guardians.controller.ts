import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { UpdateGuardianDto } from './dto/update-guardian.dto';
import { GuardiansService } from './guardians.service';

@Controller('guardians')
export class GuardiansController {
  constructor(private readonly guardiansService: GuardiansService) {}

  @Post()
  create(@Body() dto: CreateGuardianDto) {
    return this.guardiansService.create(dto);
  }

  @Get()
  findAll(@Query() filter: any) {
    return this.guardiansService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guardiansService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGuardianDto) {
    return this.guardiansService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guardiansService.remove(id);
  }
}
