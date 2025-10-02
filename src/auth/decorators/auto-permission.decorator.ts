import { SetMetadata } from '@nestjs/common';
import { PERMISSION_KEY } from './permission.decorator';

export function AutoPermission(action: string, moduleKey?: string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // Si se proporciona moduleKey, úsalo; sino, genera automáticamente
    const key =
      moduleKey ||
      target.constructor.name
        .replace('Controller', '')
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase();
    const permissionKey = `${key}:${action}`;
    SetMetadata(PERMISSION_KEY, [permissionKey])(target, propertyKey, descriptor);
  };
}
