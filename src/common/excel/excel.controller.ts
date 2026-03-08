import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ExcelService } from '../services/excel.service';
import { ExcelGenerateDto, ExcelTemplateDto } from './dto/excel-generate.dto';

@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  /**
   * Genera archivo Excel con headers + data.
   * POST body: { columns, data, sheetName?, fileName? }
   */
  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generate(@Body() dto: ExcelGenerateDto, @Res() res: Response) {
    const buffer = this.excelService.generate(dto.columns, dto.data, {
      sheetName: dto.sheetName,
      fileName: dto.fileName,
    });
    const fileName = dto.fileName ?? `export_${Date.now()}.xlsx`;
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(buffer);
  }

  /**
   * Genera plantilla Excel con headers + fila ejemplo opcional.
   * POST body: { columns, exampleRow?, sheetName?, fileName? }
   */
  @Post('template')
  @UseGuards(JwtAuthGuard)
  async template(@Body() dto: ExcelTemplateDto, @Res() res: Response) {
    const buffer = this.excelService.generateTemplate(
      dto.columns,
      dto.exampleRow,
      { sheetName: dto.sheetName, fileName: dto.fileName },
    );
    const fileName = dto.fileName ?? `plantilla_${Date.now()}.xlsx`;
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(buffer);
  }
}
