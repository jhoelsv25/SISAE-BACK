import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { FilterPersonDto } from './dto/filter.person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PersonsService } from './persons.service';

@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Post()
  async create(@Body() dto: CreatePersonDto) {
    return this.personsService.create(dto);
  }

  @Get()
  async findAll(@Query() query: FilterPersonDto) {
    return this.personsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.personsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePersonDto) {
    return this.personsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.personsService.remove(id);
  }
}
