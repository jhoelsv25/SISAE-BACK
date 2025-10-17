import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AcademicYearService } from './academic_years.service';
import { CreateAcademicYearWithPeriodsDto } from './dto/create-academic-year-with-periods.dto';
import { CreateAcademicYearDto } from './dto/create-academic_year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic_year.dto';

@Controller('academic-years')
export class AcademicYearsController {
  constructor(private readonly academicYearService: AcademicYearService) {}

  @Post()
  async create(@Body() dto: CreateAcademicYearDto) {
    return this.academicYearService.create(dto);
  }

  @Post('with-periods')
  async createWithPeriods(@Body() dto: CreateAcademicYearWithPeriodsDto) {
    return this.academicYearService.createWithPeriods(dto);
  }

  @Get()
  async findAll() {
    return this.academicYearService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.academicYearService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAcademicYearDto) {
    return this.academicYearService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.academicYearService.remove(id);
  }
}
