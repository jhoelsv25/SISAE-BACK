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

### � `db-test.sh`

**NUEVO**: Verifica la conexión a la base de datos y muestra información detallada.

```bash
./scripts/db-test.sh
```

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
