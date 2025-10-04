# SISAE Backend - Sistema Integral de Seguimiento Académico Estudiantil

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">Backend del Sistema Integral de Seguimiento Académico Estudiantil construido con <a href="http://nestjs.com/" target="_blank">NestJS</a>, PostgreSQL y TypeORM.</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white" alt="Docker" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-active-success.svg" alt="Status" />
  <img src="https://img.shields.io/badge/migrations-ready-blue.svg" alt="Migrations" />
  <img src="https://img.shields.io/badge/timezone-UTC-green.svg" alt="Timezone" />
  <img src="https://img.shields.io/badge/env-simplified-orange.svg" alt="Environment" />
  <img src="https://img.shields.io/badge/docs-5_guides-informational.svg" alt="Documentation" />
</p>

## 📋 Descripción

SISAE Backend es una API REST robusta y escalable diseñada para gestionar de manera integral el seguimiento académico estudiantil. Proporciona funcionalidades completas para la administración de usuarios, perfiles, roles, permisos, módulos académicos y un sistema de auditoría completo.

## ✨ Características Principales

- 🔐 **Autenticación y Autorización**: JWT con roles y permisos granulares
- 👥 **Gestión de Usuarios**: CRUD completo con perfiles detallados
- 🏫 **Módulos Académicos**: Sistema modular para gestión educativa
- 📊 **Sistema de Auditoría**: Seguimiento automático de todas las operaciones
- 🛡️ **Manejo de Errores**: Sistema centralizado con respuestas estandarizadas
- 📝 **Validación Robusta**: DTOs con validaciones en español
- 🐳 **Containerización**: Docker para desarrollo y producción
- 📚 **Documentación API**: Swagger/OpenAPI integrado
- 🔍 **Snake Case**: Transformación automática camelCase → snake_case
- ⚡ **Alto Rendimiento**: Optimizado para aplicaciones académicas

## 🏗️ Arquitectura

```
src/
├── app.module.ts              # Módulo principal
├── main.ts                    # Punto de entrada
├── auth/                      # Autenticación y autorización
├── audit/                     # Sistema de auditoría
├── common/                    # Utilidades compartidas
│   ├── entities/             # Entidades base
│   ├── exceptions/           # Manejo de errores
│   └── interceptors/         # Interceptores globales
├── config/                   # Configuraciones
│   ├── database.config.ts    # Configuración de BD
│   ├── cors.config.ts        # Configuración CORS
│   └── swagger.config.ts     # Configuración Swagger
└── features/                 # Módulos de funcionalidades
    ├── users/               # Gestión de usuarios
    ├── roles/               # Gestión de roles
    ├── permissions/         # Gestión de permisos
    ├── modules/             # Módulos académicos
    ├── actions/             # Acciones del sistema
    └── profile/             # Perfiles de usuario
```

## 🚀 Tecnologías

- **Framework**: NestJS 10+
- **Base de Datos**: PostgreSQL 15
- **ORM**: TypeORM con Snake Case Naming Strategy
- **Autenticación**: JWT (JSON Web Tokens)
- **Validación**: class-validator + class-transformer
- **Documentación**: Swagger/OpenAPI
- **Contenedores**: Docker & Docker Compose
- **Lenguaje**: TypeScript 5+

## 🔧 Configuración del Proyecto

### Prerrequisitos

- Node.js 18+
- PostgreSQL 15+
- Docker y Docker Compose (opcional)
- Git

### Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
# 📝 Copiar archivo de ejemplo
$ cp .env.example .env

# ✏️ Editar con tus configuraciones
$ nano .env
```

**Variables principales:**

```env
# 🗄️ Base de Datos (usado por la app y Docker Compose)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=jhoelsv
DB_PASSWORD=admin123
DB_NAME=gestion_academica
DB_LOGGING=false

# 🐳 Docker
POSTGRES_CONTAINER_NAME=sisae_postgres_db

# 🔐 JWT
JWT_SECRET=tu_jwt_secret_muy_seguro_cambiar_en_produccion
JWT_EXPIRES_IN=24h

# 🌐 CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:4200
CORS_CREDENTIALS=true

# 🚀 Aplicación
PORT=3000
NODE_ENV=development
```

**✨ Simplificación:** Ya no necesitas duplicar variables `POSTGRES_*` - Docker Compose reutiliza las variables `DB_*`.

📚 Ver guía completa: [`docs/ENV-VARIABLES.md`](docs/ENV-VARIABLES.md)

### Instalación

```bash
# Clonar el repositorio
$ git clone <repository-url>
$ cd SISAE-BACK

# Instalar dependencias
$ npm install

# Configurar variables de entorno
$ cp .env.example .env
# Editar .env con tus configuraciones

# Ejecutar con Docker (recomendado)
$ docker-compose up -d

# O ejecutar localmente
$ npm run start:dev
```

## 🚀 Ejecución

### Con Docker (Recomendado)

```bash
# Iniciar todos los servicios (PostgreSQL + API)
$ docker-compose up -d

# Ver logs
$ docker-compose logs -f

# Detener servicios
$ docker-compose down
```

### Desarrollo Local

```bash
# Modo desarrollo (hot reload)
$ npm run start:dev

# Modo producción
$ npm run start:prod

# Solo compilar
$ npm run build
```

## 📊 Base de Datos

### 🎯 Quick Start

```bash
# Iniciar PostgreSQL en Docker
$ npm run db:start

# Verificar que todo funciona
$ npm run health

# Desarrollo completo (reset + migraciones + seeds)
$ npm run dev
```

### 🗄️ Gestión de Base de Datos

```bash
# Docker
$ npm run db:start          # Iniciar PostgreSQL
$ npm run db:stop           # Detener PostgreSQL
$ npm run db:restart        # Reiniciar PostgreSQL
$ npm run db:logs           # Ver logs
$ npm run db:reset          # Reset completo (⚠️ ELIMINA DATOS)
$ npm run db:test           # Probar conexión

# Migraciones
$ npm run migration:generate NombreMigracion  # Generar migración
$ npm run migration:create NombreMigracion    # Crear vacía
$ npm run migration:run                       # Ejecutar migraciones
$ npm run migration:revert                    # Revertir última
$ npm run migration:show                      # Ver migraciones

# Procedimientos Almacenados
$ npm run db:procedures                       # Aplicar procedimientos SQL

# Datos de Prueba
$ npm run seed              # Ejecutar seeds (usuarios, roles, permisos)

# Verificación
$ npm run health            # Estado completo del sistema
$ npm run timezone          # Verificar configuración UTC
```

### 🚀 Workflows Comunes

**Primera vez / Reset completo:**

```bash
npm run dev
# Esto hace: reset → migraciones → procedimientos → seeds → start:dev
```

**Desarrollo diario:**

```bash
npm run start:dev
# Solo inicia la aplicación (DB ya configurada)
```

**Después de crear una entidad:**

```bash
npm run migration:generate CrearTablaEstudiantes
npm run migration:run
```

### ⚙️ Configuración

#### Variables de Entorno Simplificadas

Ahora solo necesitas **una sola fuente de variables** para la app y Docker:

```env
# 📝 .env - Variables usadas por la aplicación Y Docker Compose
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=jhoelsv
DB_PASSWORD=admin123
DB_NAME=gestion_academica
DB_LOGGING=false

POSTGRES_CONTAINER_NAME=sisae_postgres_db
```

✅ **Beneficios:**

- Sin duplicación (DRY - Don't Repeat Yourself)
- Menos errores de sincronización
- Más fácil de mantener

📚 Ver guía completa: [`docs/ENV-VARIABLES.md`](docs/ENV-VARIABLES.md)

### 🌍 Zona Horaria UTC

El sistema usa **UTC** en todas las capas:

- PostgreSQL: `TZ=UTC`, `PGTZ=UTC`
- Node.js: `process.env.TZ = 'UTC'`
- TypeORM: `extra.timezone = 'UTC'`

```bash
# Verificar configuración UTC
$ npm run timezone
```

📚 Ver guía completa: [`docs/TIMEZONE.md`](docs/TIMEZONE.md)

### 📁 Estructura de Base de Datos

```
src/database/
├── data-source.ts          # Configuración TypeORM CLI
├── database.service.ts     # Servicio de base de datos
├── migrations/             # 🗄️ Migraciones TypeORM
│   └── 1234567890-CreateUsersTable.ts
├── procedures/             # 📦 Procedimientos Almacenados
│   ├── audit-log-insert.sql
│   ├── permission-check.sql
│   └── clean-old-records.sql
└── seeds/                  # 🌱 Datos iniciales
    ├── seed.ts
    ├── user-default.seed.ts
    ├── roles-seed.ts
    └── permissions-seed.ts
```

### 📚 Documentación Adicional

- [`docs/SETUP-SUMMARY.md`](docs/SETUP-SUMMARY.md) - Configuración completa del sistema
- [`docs/ENV-VARIABLES.md`](docs/ENV-VARIABLES.md) - Guía de variables de entorno
- [`docs/ENV-SIMPLIFICATION.md`](docs/ENV-SIMPLIFICATION.md) - Detalles de la simplificación
- [`docs/TIMEZONE.md`](docs/TIMEZONE.md) - Configuración de zona horaria
- [`scripts/README.md`](scripts/README.md) - Guía de scripts

## 🧪 Testing

```bash
# Tests unitarios
$ npm run test

# Tests e2e
$ npm run test:e2e

# Cobertura de tests
$ npm run test:cov

# Tests en modo watch
$ npm run test:watch
```

## 📚 Documentación API

### Swagger/OpenAPI

Una vez que la aplicación esté ejecutándose, puedes acceder a la documentación interactiva:

- **Documentación API**: http://localhost:3000/docs
- **Especificación OpenAPI**: http://localhost:3000/docs-json

### Endpoints Principales

| Método | Endpoint           | Descripción               |
| ------ | ------------------ | ------------------------- |
| GET    | `/api/health`      | Estado de la aplicación   |
| POST   | `/api/auth/login`  | Autenticación de usuarios |
| GET    | `/api/users`       | Listar usuarios           |
| POST   | `/api/users`       | Crear usuario             |
| GET    | `/api/users/:id`   | Obtener usuario           |
| PUT    | `/api/users/:id`   | Actualizar usuario        |
| DELETE | `/api/users/:id`   | Eliminar usuario          |
| GET    | `/api/roles`       | Listar roles              |
| GET    | `/api/permissions` | Listar permisos           |
| GET    | `/api/modules`     | Listar módulos            |
| GET    | `/api/audit`       | Logs de auditoría         |

## 🛠️ Herramientas de Desarrollo

### ErrorHandler

Sistema centralizado de manejo de errores:

```typescript
import { ErrorHandler } from '@/common/exceptions';

// Uso directo
throw new ErrorHandler('Usuario no encontrado', HttpStatus.NOT_FOUND);

// Métodos estáticos con logging
ErrorHandler.notFound('Usuario', id);
ErrorHandler.businessLogic('No se puede eliminar el SuperAdmin');
ErrorHandler.duplicateResource('Usuario', 'email', user.email);

// Validaciones
const user = ErrorHandler.validateExists(foundUser, 'Usuario', id);
ErrorHandler.validateBusinessRule(condition, 'Mensaje de error');
```

### Sistema de Auditoría

Seguimiento automático de todas las operaciones:

```typescript
// Se registra automáticamente en todas las operaciones CRUD
// Ver logs en: GET /api/audit
```

### Validaciones

DTOs con validaciones en español:

```typescript
@IsString({ message: 'El nombre debe ser una cadena de texto' })
@MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
name: string;
```

## 🔒 Seguridad

- **JWT Authentication**: Tokens seguros con expiración configurable
- **CORS**: Configuración restrictiva para dominios permitidos
- **Helmet**: Headers de seguridad HTTP
- **Validation Pipes**: Validación estricta de entrada
- **Rate Limiting**: Control de límites de peticiones (configurable)
- **Environment Variables**: Configuración sensible en variables de entorno

## 📈 Monitoreo y Logs

### Logging

- **Desarrollo**: Logs detallados en consola
- **Producción**: Logs estructurados (JSON)
- **Auditoría**: Sistema de auditoría completo
- **Errores**: Captura y logging automático de errores

### Health Check

```bash
curl http://localhost:3000/api/health
```

Respuesta:

```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" }
  }
}
```

## 🚀 Despliegue

### Docker Production

```bash
# Construir imagen de producción
$ docker build -t sisae-backend .

# Ejecutar en producción
$ docker run -p 3000:3000 --env-file .env.production sisae-backend
```

### Variables de Entorno de Producción

```bash
NODE_ENV=production
DB_HOST=tu_postgres_host
DB_PORT=5432
DB_USERNAME=tu_usuario_prod
DB_PASSWORD=tu_password_seguro
DB_NAME=sisae_production
JWT_SECRET=tu_jwt_secret_muy_muy_seguro
CORS_ORIGIN=https://tu-dominio.com
```

### PM2 (Alternativa)

```bash
# Instalar PM2
$ npm install -g pm2

# Ejecutar con PM2
$ pm2 start dist/main.js --name sisae-backend

# Ver procesos
$ pm2 list

# Ver logs
$ pm2 logs sisae-backend
```

## 🤝 Contribución

### Flujo de Trabajo

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

### Estándares de Código

- **ESLint**: Configuración estricta
- **Prettier**: Formato automático
- **Conventional Commits**: Commits semánticos
- **TypeScript**: Tipado estricto

### Comandos de Desarrollo

```bash
# Lint
$ npm run lint

# Formato automático
$ npm run format

# Verificar tipado
$ npm run type-check
```

## 📋 Roadmap

### ✅ Completado

- [x] **Migraciones TypeORM**: Sistema completo con scripts automatizados
- [x] **Procedimientos Almacenados**: Directorio y sistema de aplicación
- [x] **UTC Timezone**: Configuración en 3 capas (PostgreSQL, Node.js, TypeORM)
- [x] **Scripts Automatizados**: 17+ scripts para gestión de BD
- [x] **Variables de Entorno**: Simplificación DRY (sin duplicación)
- [x] **Sistema de Auditoría**: Tracking automático de operaciones
- [x] **Documentación Completa**: 5 guías en `docs/`
- [x] **Health Checks**: Verificación de sistema completo

### 🚧 En Progreso

- [ ] **Testing**: Aumentar cobertura a 90%+
- [ ] **CI/CD**: Pipeline automatizado

### 📅 Planificado

- [ ] **Autenticación OAuth2**: Google, Microsoft, GitHub
- [ ] **WebSockets**: Notificaciones en tiempo real
- [ ] **Caching**: Redis para optimización
- [ ] **Rate Limiting**: Control avanzado de límites
- [ ] **Métricas**: Prometheus + Grafana
- [ ] **Backup Automático**: Respaldos programados de BD
- [ ] **API Versioning**: Versionado de endpoints

## 🐛 Reporte de Bugs

Para reportar bugs, utiliza [GitHub Issues](https://github.com/tu-usuario/SISAE-BACK/issues) con la siguiente información:

- Descripción del error
- Pasos para reproducir
- Comportamiento esperado
- Capturas de pantalla (si aplica)
- Información del entorno

## 📞 Soporte

- **Documentación**: Revisa la [documentación completa](src/common/exceptions/README.md)
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/SISAE-BACK/issues)
- **Discusiones**: [GitHub Discussions](https://github.com/tu-usuario/SISAE-BACK/discussions)

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

- **Desarrollo Backend**: [Tu Nombre](https://github.com/tu-usuario)
- **Arquitectura**: Sistema modular con NestJS
- **Base de Datos**: PostgreSQL con TypeORM

---

<p align="center">
  Desarrollado con ❤️ para el Sistema Integral de Seguimiento Académico Estudiantil (SISAE)
</p>
