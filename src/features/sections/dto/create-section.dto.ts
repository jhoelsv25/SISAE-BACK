import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateSectionDto {
  @ApiProperty({ example: 'A' })
  @IsString()
  name: string;

  @ApiProperty({ example: 30, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  capacity?: number;
}
