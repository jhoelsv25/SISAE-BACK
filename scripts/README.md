# Scripts de Base de Datos

Este directorio contiene scripts para gestionar la base de datos PostgreSQL con Docker Compose.

## Scripts disponibles:

### 🚀 `db-start.sh`

Inicia la base de datos PostgreSQL en Docker.

```bash
./scripts/db-start.sh
```

### 🛑 `db-stop.sh`

Detiene la base de datos PostgreSQL.

```bash
./scripts/db-stop.sh
```

### 🔄 `db-restart.sh`

Reinicia la base de datos PostgreSQL.

```bash
./scripts/db-restart.sh
```

### 📋 `db-logs.sh`

Muestra los logs de la base de datos en tiempo real.

```bash
./scripts/db-logs.sh
```

````markdown
# Scripts de Base de Datos y Utilidades

Este directorio contiene scripts para gestionar la base de datos PostgreSQL, migraciones y utilidades del proyecto.

## 📋 Índice

- [Scripts de Base de Datos](#scripts-de-base-de-datos)
- [Scripts de Migraciones](#scripts-de-migraciones)
- [Scripts de Desarrollo](#scripts-de-desarrollo)
- [Scripts de Utilidades](#scripts-de-utilidades)

## Scripts de Base de Datos

### 🚀 `db-start.sh`

Inicia la base de datos PostgreSQL en Docker.

```bash
npm run db:start
# o directamente
./scripts/db-start.sh
```

### 🛑 `db-stop.sh`

Detiene la base de datos PostgreSQL.

```bash
npm run db:stop
```

### 🔄 `db-restart.sh`

Reinicia la base de datos PostgreSQL.

```bash
./scripts/db-restart.sh
```

### 📋 `db-logs.sh`

Muestra los logs de la base de datos en tiempo real.

```bash
npm run db:logs
```

### ✅ `db-test.sh`

Verifica la conexión a la base de datos y muestra información detallada.

```bash
npm run db:test
```

### 🗑️ `db-reset.sh`

**⚠️ PELIGROSO**: Elimina completamente la base de datos y todos los datos.

```bash
npm run db:reset
```

### 💾 `db-backup.sh`

Crea un backup de la base de datos.

```bash
npm run db:backup
```

### 🔧 `db-procedures.sh`

Aplica todos los procedimientos almacenados SQL a la base de datos.

```bash
npm run db:procedures
```

## Scripts de Migraciones

### ✨ `migration-generate.sh`

Genera una migración automática basada en cambios en entidades.

```bash
npm run migration:generate NombreDeLaMigracion
```

### 📝 `migration-create.sh`

Crea una migración vacía para cambios manuales.

```bash
npm run migration:create NombreDeLaMigracion
```

### ▶️ `migration-run.sh`

Ejecuta todas las migraciones pendientes.

```bash
npm run migration:run          # Desarrollo
npm run migration:run:prod     # Producción
```

### ⏪ `migration-revert.sh`

Revierte la última migración ejecutada (con confirmación).

```bash
npm run migration:revert       # Desarrollo
npm run migration:revert:prod  # Producción
```

## Scripts de Desarrollo

### 🎯 `dev.sh`

**Inicio rápido completo**: Reset + Start + Migrations + Procedures + Seeds + Dev mode

```bash
npm run dev
```

Este script ejecuta en orden:

1. Reset de la base de datos
2. Inicia PostgreSQL
3. Ejecuta migraciones
4. Aplica procedimientos
5. Ejecuta seeds
6. Inicia la aplicación en modo desarrollo

### 🔧 `setup.sh`

**Setup inicial del proyecto**. Perfecto para nuevos desarrolladores.

```bash
npm run setup
```

Ejecuta:

1. Crea `.env` desde `.env.example`
2. Instala dependencias (`npm install`)
3. Inicia la base de datos
4. Ejecuta migraciones
5. Ejecuta seeds
6. Aplica procedimientos

### 🧹 `clean.sh`

**Limpieza completa del proyecto**: Elimina node_modules, dist, coverage y resetea la BD.

```bash
npm run clean
```

**⚠️ Requiere confirmación**

## Scripts de Utilidades

### 🏥 `health-check.sh`

Verifica el estado completo del sistema: Docker, PostgreSQL, Node, aplicación, etc.

```bash
npm run health
```

Verifica:

- ✅ Docker y Docker Compose
- ✅ Contenedor PostgreSQL
- ✅ Conexión a la base de datos
- ✅ Node.js y dependencias
- ✅ Aplicación corriendo
- ✅ Archivos de configuración
- ✅ Migraciones y procedimientos

## Comandos Rápidos

```bash
# Setup inicial (primera vez)
npm run setup

# Desarrollo diario
npm run dev

# Verificar sistema
npm run health

# Crear migración
npm run migration:generate MiMigracion

# Ejecutar migraciones
npm run migration:run

# Ver logs de BD
npm run db:logs

# Backup
npm run db:backup

# Limpiar todo
npm run clean
```

## Configuración

Las credenciales se configuran en el archivo `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=sisae_db
PORT=3000
```

## Requisitos

- Docker Desktop debe estar ejecutándose
- Archivo `.env` configurado (usa `.env.example` como plantilla)
- Los scripts tienen permisos de ejecución automáticamente

## Flujo de Trabajo Recomendado

### Para Desarrollo

```bash
# Inicio rápido
npm run dev

# Trabajar en tu código...

# Crear migración cuando cambies entidades
npm run migration:generate MiCambio

# Ver estado de migraciones
npm run migration:show
```

### Para Nuevo Desarrollador

```bash
# 1. Clonar el repo
git clone <repo>

# 2. Setup inicial
npm run setup

# 3. Verificar que todo funciona
npm run health

# 4. Iniciar desarrollo
npm run start:dev
```

### Para Producción

```bash
# Build
npm run build

# Ejecutar migraciones
npm run migration:run:prod

# Iniciar aplicación
npm run start:prod
```

## Troubleshooting

### Error: "Permission denied"

```bash
chmod +x scripts/*.sh
```

### Error: "Docker not found"

Asegúrate de que Docker Desktop esté corriendo.

### Error: "Connection refused"

```bash
npm run db:start
npm run db:logs
```

### Base de datos corrupta

```bash
npm run clean
npm run setup
```

## Contribuir

Al agregar nuevos scripts:

1. Hazlos ejecutables: `chmod +x script.sh`
2. Agrega comentarios explicativos
3. Actualiza este README
4. Agrega el comando en `package.json`
````

### �🗑️ `db-reset.sh`

**⚠️ PELIGROSO**: Elimina completamente la base de datos y todos los datos.

```bash
./scripts/db-reset.sh
```

## Configuración de conexión:

Las credenciales se configuran en el archivo `.env`:

- **Host**: localhost
- **Puerto**: Variable `POSTGRES_PORT` (por defecto 5432)
- **Usuario**: Variable `POSTGRES_USER`
- **Contraseña**: Variable `POSTGRES_PASSWORD`
- **Base de datos**: Variable `POSTGRES_DB`

## Requisitos:

- Docker Desktop debe estar ejecutándose
- Archivo `.env` configurado (usa `.env.example` como plantilla)
- Los scripts deben tener permisos de ejecución (ya configurados)

## Uso rápido:

1. Iniciar la base de datos: `./scripts/db-start.sh`
2. Iniciar tu aplicación NestJS: `npm run start:dev`
3. Cuando termines: `./scripts/db-stop.sh`
