import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../decorators/permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true; // no requiere permiso, se permite
    }

    const { user } = context.switchToHttp().getRequest();
    const userPermissions = user?.permissions || [];

    if (!requiredPermissions.every(permission => userPermissions.includes(permission))) {
      throw new ForbiddenException('No tienes permiso para esta acción');
    }
    return true;
  }
}
