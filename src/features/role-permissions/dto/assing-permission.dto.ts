import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignPermissionDto {
  @ApiProperty({
    description: 'ID of the role to which the permission will be assigned',
    example: 'role-12345',
  })
  @IsNotEmpty({ message: 'Role ID es requerido' })
  @IsUUID(4, { message: 'Role ID debe ser un UUID valido' })
  role_id: string;

  @ApiProperty({
    description: 'ID of the permission to be assigned to the role',
    example: 'permission-67890',
  })
  @IsNotEmpty({ message: 'Permission ID es requerido' })
  @IsUUID(4, { message: 'Permissions IDs deben ser UUIDs validos', each: true })
  permission_ids: string[];
}
