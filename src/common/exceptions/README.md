# Sistema de Manejo de Errores

Este proyecto utiliza un sistema centralizado de manejo de errores con `ErrorHandler` y `GlobalExceptionFilter`.

## ErrorHandler

Clase personalizada para crear y manejar errores de forma consistente en toda la aplicación.

### Uso Básico

```typescript
import { ErrorHandler } from '../common/exceptions';

// Error básico
throw new ErrorHandler('Mensaje de error', HttpStatus.BAD_REQUEST);

// Con contexto
throw new ErrorHandler('Mensaje de error', HttpStatus.NOT_FOUND, 'UserService');
```

### Métodos Estáticos

#### 1. `validateExists<T>`

Valida que una entidad exista, si no lanza un error 404.

```typescript
const user = await this.userRepository.findOne({ where: { id } });
ErrorHandler.validateExists(user, 'Usuario', id);
// Si user es null, lanza: "Usuario con ID "xxx" no encontrado"
```

#### 2. `validation()`

Error de validación (400 Bad Request)

```typescript
if (!email) {
  throw ErrorHandler.validation('El email es requerido', 'UserService');
}
```

#### 3. `conflict()`

Error de conflicto/duplicado (409 Conflict)

```typescript
const existing = await this.userRepository.findOne({ where: { email } });
if (existing) {
  throw ErrorHandler.conflict('El email ya está registrado', 'UserService');
}
```

#### 4. `unauthorized()`

Error de no autorizado (401 Unauthorized)

```typescript
if (!isValidPassword) {
  throw ErrorHandler.unauthorized('Contraseña incorrecta', 'AuthService');
}
```

#### 5. `forbidden()`

Error de sin permisos (403 Forbidden)

```typescript
if (!user.isActive) {
  throw ErrorHandler.forbidden('Tu cuenta está inactiva', 'AuthService');
}
```

#### 6. `internal()`

Error interno del servidor (500 Internal Server Error)

```typescript
throw ErrorHandler.internal('Error al procesar el pago', 'PaymentService');
```

#### 7. `handleUnknownError()`

Captura errores desconocidos y los convierte en ErrorHandler

```typescript
try {
  // ... operación riesgosa
} catch (error) {
  ErrorHandler.handleUnknownError(error, 'Error durante la operación');
}
```

## Ejemplo Completo en un Servicio

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandler } from '../common/exceptions';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    try {
      // Validar duplicado
      const existing = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (existing) {
        throw ErrorHandler.conflict('El email ya está registrado', 'UserService');
      }

      // Crear usuario
      const user = this.userRepository.create(dto);
      return await this.userRepository.save(user);
    } catch (error) {
      ErrorHandler.handleUnknownError(error, 'Error al crear usuario');
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      return ErrorHandler.validateExists(user, 'Usuario', id);
    } catch (error) {
      ErrorHandler.handleUnknownError(error, 'Error al buscar usuario');
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    try {
      const user = await this.findOne(id); // Ya valida existencia
      Object.assign(user, dto);
      return await this.userRepository.save(user);
    } catch (error) {
      ErrorHandler.handleUnknownError(error, 'Error al actualizar usuario');
    }
  }

  async remove(id: string) {
    try {
      const user = await this.findOne(id);

      // Validar permisos de negocio
      if (user.role?.name === 'SuperAdmin') {
        throw ErrorHandler.forbidden('No se puede eliminar un SuperAdmin');
      }

      await this.userRepository.remove(user);
      return { message: 'Usuario eliminado exitosamente' };
    } catch (error) {
      ErrorHandler.handleUnknownError(error, 'Error al eliminar usuario');
    }
  }
}
```

## GlobalExceptionFilter

El filtro global captura todas las excepciones y las formatea de manera consistente.

### Respuesta de Error Estándar

```json
{
  "statusCode": 404,
  "message": "Usuario con ID \"123\" no encontrado",
  "context": "Usuario",
  "timestamp": "2025-10-04T12:00:00.000Z",
  "path": "/api/users/123"
}
```

### Errores de Base de Datos

El filtro automáticamente maneja errores comunes de PostgreSQL:

- **23505**: Violación de constraint único → 409 Conflict
- **23503**: Violación de foreign key → 400 Bad Request
- **23502**: Campo NOT NULL vacío → 400 Bad Request

## Buenas Prácticas

1. **Usa los métodos estáticos** para errores comunes (validation, conflict, etc.)
2. **Agrega contexto** para identificar de dónde viene el error
3. **Usa `handleUnknownError`** en bloques catch para errores inesperados
4. **Valida con `validateExists`** para búsquedas de entidades
5. **No captures errores en servicios intermedios**, déjalos propagarse
6. **Captura solo en servicios finales** que hacen operaciones reales

## Estructura de Archivos

```
src/common/exceptions/
├── error-handler.ts          # Clase ErrorHandler
├── http-exception.filter.ts  # Filtro global de excepciones
└── index.ts                   # Exports
```

## Configuración en main.ts

```typescript
import { GlobalExceptionFilter } from './common/exceptions';

// ...
app.useGlobalFilters(new GlobalExceptionFilter());
```

## Variables de Entorno

En **desarrollo** (`NODE_ENV=development`), las respuestas incluyen el stack trace completo.
En **producción**, solo se envía el mensaje de error sin detalles internos.
