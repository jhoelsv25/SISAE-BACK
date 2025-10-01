import { SetMetadata } from '@nestjs/common';

export function AutoPermission(action: string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // Obtén el nombre del controlador (ej: 'ModulesController')
    const controllerName = target.constructor.name.replace('Controller', '');
    // Convierte a kebab-case (ej: 'AdminModules' -> 'admin-modules')
    const moduleKey = controllerName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    const permissionKey = `${moduleKey}:${action}`;
    SetMetadata('permissions', [permissionKey])(target, propertyKey, descriptor);
  };
}
