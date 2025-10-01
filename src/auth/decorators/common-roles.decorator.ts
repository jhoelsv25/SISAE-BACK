import { applyDecorators } from '@nestjs/common';
import { Roles } from './role.decorator';

export function CommonRoles() {
  return applyDecorators(Roles('Super Admin', 'Admin', 'User'));
}

export function AdminRoles() {
  return applyDecorators(Roles('Super Admin', 'Admin'));
}

export function OnlySuperAdmin() {
  return applyDecorators(Roles('Super Admin'));
}
