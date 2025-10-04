# Migraciones de Base de Datos

Este directorio contiene todas las migraciones de TypeORM para el proyecto.

## Comandos Disponibles

### Desarrollo

```bash
# Generar una migración basada en cambios de entidades
npm run migration:generate NombreDeLaMigracion

# Crear una migración vacía (para cambios manuales)
npm run migration:create NombreDeLaMigracion

# Ejecutar todas las migraciones pendientes
npm run migration:run

# Revertir la última migración
npm run migration:revert

# Mostrar el estado de las migraciones
npm run migration:show
```

### Producción

```bash
# Ejecutar migraciones en producción
npm run migration:run:prod

# Revertir migración en producción
npm run migration:revert:prod
```

## Ejemplo de Uso

```bash
# 1. Hacer cambios en una entidad
# 2. Generar la migración
npm run migration:generate AddEmailIndexToUsers

# 3. Revisar el archivo generado en src/database/migrations/
# 4. Ejecutar la migración
npm run migration:run
```

## Convenciones de Nombres

- Use PascalCase para los nombres de migraciones
- Sea descriptivo: `CreateUsersTable`, `AddIndexToPermissions`, `UpdateUserSchema`
- Evite nombres genéricos como `Update` o `Change`

## Notas Importantes

- **NUNCA** ejecute `synchronize: true` en producción
- Siempre revise las migraciones generadas antes de ejecutarlas
- Las migraciones se ejecutan en orden cronológico (por timestamp)
- En producción, las entidades y migraciones se cargan desde `dist/`
- En desarrollo, se cargan directamente desde `src/`

## Configuración por Entorno

### Desarrollo

- Entidades: `src/**/*.entity{.ts,.js}`
- Migraciones: `src/database/migrations/*{.ts,.js}`
- Logging: Activado si `DB_LOGGING=true`
- SSL: Desactivado

### Producción

- Entidades: `dist/**/*.entity.js`
- Migraciones: `dist/database/migrations/*.js`
- Logging: Solo errores, warnings y migraciones
- SSL: Activado con `rejectUnauthorized: false`
- Pool de conexiones: min=5, max=20

## Rollback en Producción

Si una migración falla en producción:

```bash
# 1. Revertir la última migración
npm run migration:revert:prod

# 2. Corregir el problema
# 3. Volver a generar/ajustar la migración
# 4. Ejecutar nuevamente
npm run migration:run:prod
```

## 🔧 Procedimientos Almacenados

Los procedimientos almacenados, funciones y triggers de PostgreSQL se gestionan en el directorio `src/database/procedures/`.

### Aplicar todos los procedimientos:

```bash
npm run db:procedures
```

### Incluir procedimientos en migraciones:

Ver el archivo de ejemplo: `migrations/1700000000000-AddDatabaseProcedures.ts.example`

Para más información, consulta: [Procedimientos README](../procedures/README.md)
