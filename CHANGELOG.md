# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [Sin versión] - 2025-01-03

### 🎯 Añadido

#### Sistema de Migraciones
- ✅ Configuración TypeORM CLI con `data-source.ts`
- ✅ Directorio `src/database/migrations/` para migraciones
- ✅ Scripts automatizados:
  - `npm run migration:generate NombreMigracion`
  - `npm run migration:create NombreMigracion`
  - `npm run migration:run`
  - `npm run migration:revert`
  - `npm run migration:show`

#### Procedimientos Almacenados
- ✅ Directorio `src/database/procedures/` para SQL
- ✅ Scripts de ejemplo:
  - `audit-log-insert.sql` - Inserción de logs de auditoría
  - `permission-check.sql` - Verificación de permisos
  - `clean-old-records.sql` - Limpieza de registros antiguos
- ✅ Comando `npm run db:procedures` para aplicar procedimientos

#### Zona Horaria UTC
- ✅ Configuración PostgreSQL: `TZ=UTC`, `PGTZ=UTC`
- ✅ Configuración Node.js: `process.env.TZ = 'UTC'`
- ✅ Configuración TypeORM: `extra.timezone = 'UTC'`
- ✅ Script de verificación: `npm run timezone`
- ✅ Documentación completa en `docs/TIMEZONE.md`

#### Scripts de Automatización
- ✅ **Base de Datos:**
  - `npm run db:start` - Iniciar PostgreSQL
  - `npm run db:stop` - Detener PostgreSQL
  - `npm run db:restart` - Reiniciar PostgreSQL
  - `npm run db:logs` - Ver logs
  - `npm run db:reset` - Reset completo
  - `npm run db:test` - Probar conexión
- ✅ **Migraciones:** (ver arriba)
- ✅ **Procedimientos:**
  - `npm run db:procedures` - Aplicar procedimientos SQL
- ✅ **Seeds:**
  - `npm run seed` - Ejecutar seeds
- ✅ **Workflows:**
  - `npm run setup` - Configuración inicial
  - `npm run dev` - Reset + migraciones + seeds + dev
  - `npm run clean` - Limpiar node_modules y dist
- ✅ **Verificación:**
  - `npm run health` - Estado del sistema
  - `npm run timezone` - Verificar UTC

#### Documentación
- ✅ `docs/SETUP-SUMMARY.md` - Configuración completa del sistema
- ✅ `docs/TIMEZONE.md` - Guía de zona horaria UTC
- ✅ `docs/FIXES-ACTION-TO-ACTIONS.md` - Migración de entidades
- ✅ `docs/ENV-VARIABLES.md` - Guía de variables de entorno
- ✅ `docs/ENV-SIMPLIFICATION.md` - Detalles de simplificación
- ✅ `scripts/README.md` - Guía de scripts
- ✅ README.md actualizado con toda la información

### 🔄 Cambiado

#### Variables de Entorno
- **ANTES:** Duplicación entre app y Docker
  ```env
  DB_USERNAME=jhoelsv
  POSTGRES_USER=jhoelsv      # DUPLICADO
  ```
- **AHORA:** Una sola fuente de verdad
  ```env
  DB_USERNAME=jhoelsv        # Usado por app y Docker
  ```
- ✅ Reducción de 11 a 7 variables de BD
- ✅ Docker Compose reutiliza variables `DB_*`
- ✅ `.env.example` actualizado
- ✅ Todos los scripts actualizados

#### Configuración de Base de Datos
- ✅ `database.config.ts` sincronizado con `data-source.ts`
- ✅ Añadido `synchronize: false` (usar migraciones)
- ✅ Añadida configuración de pool para producción
- ✅ Timezone UTC en configuración

#### Entidades
- ✅ `PermissionEntity.action` → `PermissionEntity.actions[]`
- ✅ Migración de ManyToOne a ManyToMany
- ✅ Seeds actualizados para usar array
- ✅ Repositorios actualizados con nuevas relaciones

### 🐛 Corregido

- ✅ Migraciones generándose en directorio incorrecto
- ✅ Seeds fallando por cambios en entidades
- ✅ Queries de repositorio con relaciones desactualizadas
- ✅ Scripts usando variables de entorno incorrectas
- ✅ Conexión a BD fallando después de simplificación

### 📚 Documentación

Ver las siguientes guías para más información:

- [Configuración Completa](docs/SETUP-SUMMARY.md)
- [Variables de Entorno](docs/ENV-VARIABLES.md)
- [Simplificación ENV](docs/ENV-SIMPLIFICATION.md)
- [Zona Horaria UTC](docs/TIMEZONE.md)
- [Migración de Entidades](docs/FIXES-ACTION-TO-ACTIONS.md)
- [Guía de Scripts](scripts/README.md)

---

## 📅 Versiones Futuras

### [0.2.0] - Planificado
- [ ] Tests unitarios con cobertura 90%+
- [ ] CI/CD pipeline
- [ ] Rate limiting avanzado

### [0.3.0] - Planificado
- [ ] Autenticación OAuth2
- [ ] WebSockets para notificaciones
- [ ] Sistema de caché con Redis

### [1.0.0] - Planificado
- [ ] Versión estable de producción
- [ ] Documentación API completa
- [ ] Métricas con Prometheus/Grafana

---

**Leyenda:**
- ✅ Completado
- 🚧 En progreso
- 📅 Planificado
- 🐛 Bug fix
- 🔄 Cambio
- 🎯 Nueva característica
