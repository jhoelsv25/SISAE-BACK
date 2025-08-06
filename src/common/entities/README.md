# BaseEntity

La clase `BaseEntity` es una entidad abstracta que proporciona campos comunes para todas las entidades de la aplicación.

## Características

### Campos automáticos:
- **`id`**: UUID generado automáticamente como clave primaria
- **`createdAt`**: Timestamp de creación (se establece automáticamente)
- **`updatedAt`**: Timestamp de última actualización (se actualiza automáticamente)
- **`deletedAt`**: Timestamp de eliminación suave (soft delete)

### Beneficios:
- ✅ **Consistencia**: Todas las entidades tienen los mismos campos base
- ✅ **Automático**: Los timestamps se manejan automáticamente por TypeORM
- ✅ **UUID**: Identificadores únicos universales
- ✅ **Soft Delete**: Eliminación suave habilitada por defecto

## Uso

### 1. Importar la BaseEntity:
```typescript
import { BaseEntity } from 'entities/base.entity';
```

### 2. Extender de BaseEntity:
```typescript
import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'entities/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  // BaseEntity ya proporciona: id, createdAt, updatedAt, deletedAt
}
```

### 3. Resultado en la base de datos:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firstName VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP(6),
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  deletedAt TIMESTAMP NULL
);
```

## Métodos heredados de TypeORM

Al extender de `BaseEntity`, todas tus entidades tienen acceso a métodos estáticos como:

```typescript
// Crear y guardar
const user = User.create({ firstName: 'John', email: 'john@example.com' });
await user.save();

// Buscar
const users = await User.find();
const user = await User.findOne({ where: { email: 'john@example.com' } });

// Actualizar
await User.update({ id: 'uuid' }, { firstName: 'Jane' });

// Eliminar (soft delete si está configurado)
await User.softDelete({ id: 'uuid' });
```

## Configuración del path

En `tsconfig.json` está configurado el path:
```json
"entities/*": ["src/common/entities/*"]
```

Esto permite importar con:
```typescript
import { BaseEntity } from 'entities/base.entity';
```

## Ubicación del archivo

```
src/
  common/
    entities/
      base.entity.ts  ← Aquí está la BaseEntity
```
