import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles required, allow access
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) {
      throw new ForbiddenException('No tienes rol asignado');
    }
    // user.role puede ser string o { name: string }, ajusta según tu modelo
    const userRoles = Array.isArray(user.role)
      ? user.role
      : typeof user.role === 'string'
        ? [user.role]
        : user.role?.name
          ? [user.role.name]
          : [];
    return requiredRoles.some(role => userRoles.includes(role));
  }
}
