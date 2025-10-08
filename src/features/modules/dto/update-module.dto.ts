import { PartialType } from '@nestjs/swagger';
import { CreateModuleDto } from './create-module.dto';

export class UpdateModuleDto extends PartialType(CreateModuleDto) {
  // Todos los campos de CreateModuleDto son opcionales automáticamente
  // No es necesario redeclararlos
}
