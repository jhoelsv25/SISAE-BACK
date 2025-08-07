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
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=sisae_user
DB_PASSWORD=sisae_password
DB_NAME=sisae_db
DB_LOGGING=false

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro
JWT_EXPIRES_IN=24h

# Aplicación
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:4200
```

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

### Migraciones

```bash
# Generar migración
$ npm run migration:generate -- src/migrations/MigrationName

# Ejecutar migraciones
$ npm run migration:run

# Revertir migración
$ npm run migration:revert
```

### Sincronización (Solo desarrollo)

La sincronización automática está habilitada en desarrollo. Las entidades se sincronizan automáticamente con la base de datos.

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

- [ ] **Autenticación OAuth2**: Google, Microsoft, GitHub
- [ ] **WebSockets**: Notificaciones en tiempo real
- [ ] **Caching**: Redis para optimización
- [ ] **Rate Limiting**: Control avanzado de límites
- [ ] **Métricas**: Prometheus + Grafana
- [ ] **Testing**: Cobertura 90%+
- [ ] **CI/CD**: Pipeline automatizado
- [ ] **Backup Automático**: Respaldos programados

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
