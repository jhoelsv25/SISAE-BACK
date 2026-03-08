import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ExcelColumnDto {
  @ApiProperty({ example: 'name' })
  @IsString()
  key: string;

  @ApiProperty({ example: 'Nombre' })
  @IsString()
  label: string;
}

export class ExcelGenerateDto {
  @ApiProperty({
    type: [ExcelColumnDto],
    example: [
      { key: 'name', label: 'Nombre' },
      { key: 'email', label: 'Email' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExcelColumnDto)
  columns: ExcelColumnDto[];

  @ApiProperty({
    type: 'array',
    items: { type: 'object' },
    example: [{ name: 'Juan', email: 'juan@test.com' }],
  })
  @IsArray()
  data: Record<string, unknown>[];

  @ApiPropertyOptional({ example: 'Estudiantes' })
  @IsOptional()
  @IsString()
  sheetName?: string;

  @ApiPropertyOptional({ example: 'estudiantes.xlsx' })
  @IsOptional()
  @IsString()
  fileName?: string;
}

export class ExcelTemplateDto {
  @ApiProperty({
    type: [ExcelColumnDto],
    example: [
      { key: 'name', label: 'Nombre' },
      { key: 'email', label: 'Email' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExcelColumnDto)
  columns: ExcelColumnDto[];

  @ApiPropertyOptional({ example: { name: 'Ejemplo', email: 'ejemplo@test.com' } })
  @IsOptional()
  @IsObject()
  exampleRow?: Record<string, unknown>;

  @ApiPropertyOptional({ example: 'Plantilla' })
  @IsOptional()
  @IsString()
  sheetName?: string;

  @ApiPropertyOptional({ example: 'plantilla.xlsx' })
  @IsOptional()
  @IsString()
  fileName?: string;
}
