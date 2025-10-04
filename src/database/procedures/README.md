# Procedimientos Almacenados y Funciones de Base de Datos

Este directorio contiene todos los procedimientos almacenados, funciones, triggers y vistas de PostgreSQL para el proyecto.

## 📁 Estructura

```
procedures/
├── audit-user-changes.sql          # Función para auditoría de cambios
├── get-user-permissions.sql        # Obtener permisos de un usuario
├── user-has-permission.sql         # Verificar si usuario tiene permiso
└── README.md                       # Este archivo
```

## 🚀 Aplicar Procedimientos

### Opción 1: Script Automático (Recomendado)

Ejecuta todos los procedimientos SQL de una vez:

```bash
npm run db:procedures
```

### Opción 2: Mediante Migración

Los procedimientos también se pueden aplicar mediante migraciones de TypeORM. Ver ejemplo en:
`migrations/1700000000000-AddDatabaseProcedures.ts.example`

Para crear una migración que aplique procedimientos:

```bash
npm run migration:create AddStoredProcedures
```

Luego, copia el contenido del archivo de ejemplo y ajusta según necesites.

## 📝 Procedimientos Disponibles

### 1. `audit_user_changes()`

**Tipo:** Trigger Function  
**Descripción:** Audita automáticamente los cambios en la tabla de usuarios.

**Uso:**

```sql
-- El trigger se activa automáticamente en UPDATE o DELETE
UPDATE users SET email = 'new@email.com' WHERE id = 'xxx';
```

### 2. `get_user_permissions(user_id UUID)`

**Tipo:** Function  
**Retorna:** Tabla con permisos del usuario  
**Descripción:** Obtiene todos los permisos de un usuario basado en sus roles.

**Uso:**

```sql
SELECT * FROM get_user_permissions('550e8400-e29b-41d4-a716-446655440000');
```

**Resultado:**

```
permission_name  | module_name | action_name
-----------------|-------------|------------
User Management  | Users       | Create
User Management  | Users       | Read
```

### 3. `user_has_permission(user_id UUID, module_name VARCHAR, action_name VARCHAR)`

**Tipo:** Function  
**Retorna:** BOOLEAN  
**Descripción:** Verifica si un usuario tiene un permiso específico.

**Uso:**

```sql
SELECT user_has_permission(
    '550e8400-e29b-41d4-a716-446655440000',
    'Users',
    'Create'
);
```

**Resultado:**

```
user_has_permission
-------------------
true
```

## 🔧 Crear Nuevos Procedimientos

1. **Crear el archivo SQL** en este directorio:

   ```bash
   touch src/database/procedures/mi-nuevo-procedimiento.sql
   ```

2. **Escribir el procedimiento:**

   ```sql
   CREATE OR REPLACE FUNCTION mi_funcion()
   RETURNS VARCHAR AS $$
   BEGIN
       RETURN 'Hello World';
   END;
   $$ LANGUAGE plpgsql;
   ```

3. **Aplicar el procedimiento:**

   ```bash
   npm run db:procedures
   ```

   O crear una migración:

   ```bash
   npm run migration:create AddMiFuncion
   ```

## 🎯 Mejores Prácticas

1. **Versionamiento:** Siempre usa `CREATE OR REPLACE FUNCTION` para poder actualizar
2. **Documentación:** Incluye comentarios explicando qué hace el procedimiento
3. **Manejo de Errores:** Usa bloques `EXCEPTION` para manejar errores
4. **Performance:** Usa `RETURNS TABLE` en lugar de `RETURNS SETOF` cuando sea posible
5. **Seguridad:** Define `SECURITY DEFINER` solo cuando sea necesario

## 📊 Uso desde NestJS

Puedes llamar estos procedimientos desde tu código:

```typescript
// En un servicio
async getUserPermissions(userId: string) {
  const result = await this.dataSource.query(
    'SELECT * FROM get_user_permissions($1)',
    [userId]
  );
  return result;
}

async checkPermission(userId: string, module: string, action: string) {
  const result = await this.dataSource.query(
    'SELECT user_has_permission($1, $2, $3) as has_permission',
    [userId, module, action]
  );
  return result[0].has_permission;
}
```

## 🗑️ Eliminar Procedimientos

Para eliminar un procedimiento en una migración:

```typescript
public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`DROP FUNCTION IF EXISTS mi_funcion();`);
  await queryRunner.query(`DROP TRIGGER IF EXISTS mi_trigger ON mi_tabla;`);
}
```

## 📚 Recursos

- [PostgreSQL Functions Documentation](https://www.postgresql.org/docs/current/sql-createfunction.html)
- [PostgreSQL Triggers Documentation](https://www.postgresql.org/docs/current/sql-createtrigger.html)
- [PL/pgSQL Documentation](https://www.postgresql.org/docs/current/plpgsql.html)
