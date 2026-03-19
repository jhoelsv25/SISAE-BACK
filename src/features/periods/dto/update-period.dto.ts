import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PeriodStatus } from '@common/enums/global.enum';
import { CreatePeriodDto } from './create-period.dto';

export class UpdatePeriodDto extends PartialType(CreatePeriodDto) {
  @ApiPropertyOptional({ enum: PeriodStatus, description: 'Nuevo estado del periodo' })
  @IsOptional()
  @IsEnum(PeriodStatus, { message: 'El estado del periodo debe ser válido.' })
  status?: PeriodStatus;
}
