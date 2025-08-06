import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../decorators/permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.getAllAndOverride<string[]>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermission) {
      return true; // no requiere permiso, se permite
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role || !user.role.permissions) {
      throw new ForbiddenException('No tienes permisos para esta acción');
    }
    const userPermissions = user.permissions || []; // Asegurarse de que siempre sea un array

    if (!userPermissions.includes(requiredPermission)) {
      throw new ForbiddenException('No tienes permiso para esta acción');
    }

    return requiredPermission.every(permission => userPermissions.includes(permission));
  }
}
