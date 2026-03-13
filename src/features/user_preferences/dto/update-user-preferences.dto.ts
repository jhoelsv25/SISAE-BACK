import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class UpdateUserPreferencesDto {
  @ApiProperty({
    example: { digest: true, approvals: false },
    description: 'Preferencias del usuario en formato JSON.',
  })
  @IsObject({ message: 'Las preferencias deben ser un objeto JSON.' })
  preferences: Record<string, any>;
}
