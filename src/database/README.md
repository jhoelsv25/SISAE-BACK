# Database Management

Gestión completa de base de datos del proyecto SISAE-BACK.

## 📁 Estructura

```
database/
├── migrations/              # Migraciones de TypeORM
│   ├── *.ts                # Archivos de migración
│   └── README.md           # Documentación de migraciones
├── procedures/             # Procedimientos almacenados
│   ├── *.sql              # Archivos SQL de procedimientos
│   └── README.md          # Documentación de procedimientos
├── seeds/                 # Datos iniciales
│   ├── seed.ts           # Script principal de seeding
│   └── *.seed.ts         # Seeds individuales
├── data-source.ts        # Configuración de TypeORM CLI
├── database.service.ts   # Servicio de base de datos
└── database-procedures.service.ts  # Servicio para procedimientos
```

## 🚀 Inicio Rápido

### 1. Iniciar Base de Datos

```bash
# Iniciar contenedor de PostgreSQL
npm run db:start

# Ver logs de la base de datos
npm run db:logs

# Detener la base de datos
npm run db:stop
```

### 2. Migraciones

```bash
# Generar migración automática
npm run migration:generate NombreDeLaMigracion

# Crear migración vacía
npm run migration:create NombreDeLaMigracion

# Ejecutar migraciones pendientes
npm run migration:run

# Revertir última migración
npm run migration:revert

# Ver estado de migraciones
npm run migration:show
```

### 3. Procedimientos Almacenados

```bash
# Aplicar todos los procedimientos SQL
npm run db:procedures
```

### 4. Seeds (Datos Iniciales / Mock)

```bash
# Ejecutar todos los seeds (roles, módulos, permisos, docentes, usuarios, demo académica + datos mock)
npm run seed

# Solo datos mock (anuncios, evaluaciones, tareas, notificaciones, módulos de aprendizaje)
# Útil cuando ya tienes data académica
npm run seed:mock
```

Los seeds de datos mock incluyen: anuncios, evaluaciones, tareas (assignments), notificaciones y módulos de aprendizaje, para ver el sistema poblado.

### 5. Reset Completo

```bash
# Reset + Start + Seed + Dev Mode
npm run db:sync

# Reset + Start + Test DB
npm run db:fresh
```

## 🔄 Flujo de Trabajo Típico

### Desarrollo de Nueva Funcionalidad

```bash
# 1. Crear/modificar entidades en src/features/*/entities/
# 2. Generar migración basada en cambios
npm run migration:generate AddNewFeature

# 3. Revisar la migración generada
code src/database/migrations/[timestamp]-AddNewFeature.ts

# 4. Ejecutar migración
npm run migration:run

# 5. Si necesitas procedimientos, créalos
code src/database/procedures/my-procedure.sql

# 6. Aplicar procedimientos
npm run db:procedures

# 7. Actualizar seeds si es necesario
code src/database/seeds/my-feature-seed.ts

# 8. Ejecutar seeds
npm run seed
```

### Reset y Prueba Completa

```bash
# Limpiar todo y empezar de cero
npm run db:fresh

# Verificar que todo funciona
npm run start:dev
```

## 📊 Configuración por Entorno

### Development

- Archivo: `.env`
- Entities: `src/**/*.entity.ts`
- Migrations: `src/database/migrations/*.ts`
- Synchronize: `false` (usar migraciones)

### Production

- Archivo: `.env.production`
- Entities: `dist/**/*.entity.js`
- Migrations: `dist/database/migrations/*.js`
- Synchronize: `false`
- SSL: Habilitado

## 🛠️ Scripts Disponibles

### Base de Datos

- `db:start` - Iniciar PostgreSQL en Docker
- `db:stop` - Detener PostgreSQL
- `db:reset` - Resetear base de datos
- `db:logs` - Ver logs
- `db:backup` - Hacer backup
- `db:test` - Configurar BD de prueba
- `db:sync` - Reset + Start + Seed + Dev
- `db:fresh` - Reset + Start + Test

### Migraciones

- `migration:generate <nombre>` - Generar migración
- `migration:create <nombre>` - Crear migración vacía
- `migration:run` - Ejecutar migraciones
- `migration:run:prod` - Ejecutar en producción
- `migration:revert` - Revertir última
- `migration:revert:prod` - Revertir en producción
- `migration:show` - Mostrar estado

### Procedimientos y Seeds

- `db:procedures` - Aplicar procedimientos SQL
- `seed` - Ejecutar todos los seeds (base + demo académica + mock)
- `seed:mock` - Solo seeds de datos mock (anuncios, evaluaciones, tareas, notificaciones, módulos)

## 📝 Convenciones

### Migraciones

- Nombres: PascalCase descriptivo
  - ✅ `CreateUsersTable`
  - ✅ `AddEmailIndexToUsers`
  - ❌ `Update`, `Migration1`

### Procedimientos

- Nombres: kebab-case descriptivo
  - ✅ `get-user-permissions.sql`
  - ✅ `audit-user-changes.sql`
  - ❌ `function.sql`, `proc1.sql`

### Seeds

- Nombres: kebab-case + `-seed.ts`
  - ✅ `users-seed.ts`
  - ✅ `permissions-seed.ts`

## 🔐 Seguridad

1. **NUNCA** commits credenciales en el código
2. Usa variables de entorno (`.env`)
3. En producción, usa `synchronize: false`
4. Revisa migraciones antes de ejecutar en producción
5. Haz backups antes de cambios grandes

## 📚 Recursos

- [TypeORM Migrations](https://typeorm.io/migrations)
- [PostgreSQL Functions](https://www.postgresql.org/docs/current/sql-createfunction.html)
- [NestJS Database](https://docs.nestjs.com/techniques/database)
- [Migraciones README](./migrations/README.md)
- [Procedimientos README](./procedures/README.md)

## ❓ Troubleshooting

### Error: "Migration table not found"

```bash
npm run migration:run
```

### Error: "Entity not found"

```bash
# Verificar que la entidad tiene el decorador @Entity()
# y está en la ruta correcta
```

### Error: "Connection refused"

```bash
# Verificar que PostgreSQL está corriendo
npm run db:start
npm run db:logs
```

### Migración no se genera

```bash
# Verificar cambios en entidades
# Asegurarse de que synchronize: false
```

## 🤝 Contribuir

1. Documenta todas las migraciones
2. Incluye `up()` y `down()` en migraciones
3. Prueba rollback antes de commit
4. Actualiza README si agregas nuevos procedimientos
5. Mantén seeds actualizados
