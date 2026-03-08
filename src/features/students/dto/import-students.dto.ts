import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsInt, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';

export class ImportStudentRowDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'juan@ejemplo.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 15, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(120)
  age?: number;

  @ApiProperty({ example: '1ro', required: false })
  @IsOptional()
  @IsString()
  grade?: string;
}

export class ImportStudentsDto {
  @ApiProperty({ type: [ImportStudentRowDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportStudentRowDto)
  rows: ImportStudentRowDto[];
}
