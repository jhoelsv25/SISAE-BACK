import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateStudentDto } from './dto/create-student.dto';
import { ImportStudentsDto } from './dto/import-students.dto';
import { ImportStartDto } from './dto/import-start.dto';
import { FilterStudentDto } from './dto/filter-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsService } from './students.service';
import { StudentsImportService } from './students-import.service';

@Controller('students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly studentsImportService: StudentsImportService,
  ) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Post('import')
  import(@Body() dto: ImportStudentsDto) {
    return this.studentsService.import(dto);
  }

  @Post('import/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async importUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file?.buffer) {
      throw new BadRequestException('Debe subir un archivo Excel');
    }
    return this.studentsImportService.upload(file);
  }

  @Post('import/start')
  @UseGuards(JwtAuthGuard)
  async importStart(@Body() dto: ImportStartDto, @Req() req: Request) {
    const userId = (req as any).user?.sub ?? (req as any).user?.id;
    return this.studentsImportService.startImport(dto, userId);
  }

  @Get()
  findAll(@Query() query: FilterStudentDto) {
    return this.studentsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}
