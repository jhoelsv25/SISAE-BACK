import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { AssignPermissionDto } from './assing-permission.dto';

export class RemovePermissionDto extends PartialType(AssignPermissionDto) {
  @ApiProperty({
    description: 'ID of the role to which the permission will be assigned',
    example: 'role-12345',
  })
  @IsNotEmpty({ message: 'Role ID es requerido' })
  @IsUUID(4, { message: 'Role ID debe ser un UUID valido' })
  role_id: string;

  @ApiProperty({
    description: 'IDs of the permissions to be assigned to the role',
    example: ['permission-67890'],
  })
  @IsNotEmpty({ message: 'Permission IDs son requeridos' })
  @IsUUID(4, { message: 'Permission IDs deben ser UUIDs validos', each: true })
  permission_ids?: string[];
}
