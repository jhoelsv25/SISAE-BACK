import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Pérez García' })
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({ example: 'DNI', enum: ['DNI', 'CE', 'PASSPORT'] })
  @IsString()
  @IsIn(['DNI', 'CE', 'PASSPORT'])
  docType: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @MaxLength(30)
  docNumber: string;

  @ApiProperty({ example: 'M', enum: ['M', 'F', 'O'] })
  @IsString()
  @IsIn(['M', 'F', 'O'])
  gender: string;

  @ApiProperty({ example: '2010-04-21' })
  @IsString()
  birthDate: string;

  @ApiProperty({ example: '987654321', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({ example: 'Av. Siempre Viva 123', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @ApiProperty({ example: 'student@example.com' })
  @IsEmail()
  @MaxLength(100)
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  email: string;

  @ApiProperty({ example: 'jperez123' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_-]+$/)
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  username: string;

  @ApiProperty({ example: 'MiContrasena123', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password?: string;

  @ApiProperty({ example: 'A2026001' })
  @IsString()
  @MaxLength(100)
  studentCode: string;

  @ApiProperty({ example: 'https://localhost:3000/uploads/persons/a2026001.jpg', required: false })
  @IsOptional()
  @IsUrl({ require_tld: false })
  photoUrl?: string;

  @ApiProperty({
    example: 'cdc7b8bf-7331-47a5-8785-76e516b3b0eb',
    required: false,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4')
  institution?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  isActive?: boolean;
}
