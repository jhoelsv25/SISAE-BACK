#!/bin/bash

# Script para verificar la configuración de zona horaria
# Uso: ./scripts/check-timezone.sh

echo "🕐 Verificación de Zona Horaria UTC"
echo "===================================="
echo ""

# Cargar variables de entorno
if [ -f .env ]; then
    set -a
    source .env 2>/dev/null
    set +a
fi

DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_USERNAME=${DB_USERNAME:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres}
DB_NAME=${DB_NAME:-sisae_db}

# Check 1: Sistema operativo
echo "💻 Sistema Operativo:"
if [ "$(uname)" == "Darwin" ]; then
    SYSTEM_TZ=$(readlink /etc/localtime | sed 's#/var/db/timezone/zoneinfo/##')
else
    SYSTEM_TZ=$(timedatectl | grep "Time zone" | awk '{print $3}')
fi
echo "  Zona horaria del sistema: $SYSTEM_TZ"
echo "  Hora actual del sistema: $(date)"
echo ""

# Check 2: Node.js / Aplicación
echo "📦 Node.js / Aplicación:"
echo "  TZ variable: ${TZ:-'no configurada'}"
if [ -z "$TZ" ]; then
    echo "  ⚠️  TZ no está configurada (se usará la del sistema)"
    echo "  💡 Recomendación: export TZ=UTC"
else
    echo "  ✅ TZ configurada: $TZ"
fi
echo ""

# Check 3: PostgreSQL Container
echo "🗄️  PostgreSQL Container:"
export PGPASSWORD=$DB_PASSWORD

if docker ps | grep -q "${POSTGRES_CONTAINER_NAME:-sisae-postgres}"; then
    echo "  ✅ Contenedor corriendo"
    
    # Verificar timezone de PostgreSQL
    if command -v psql &> /dev/null; then
        echo ""
        echo "  📊 Configuración de PostgreSQL:"
        
        PG_TZ=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_NAME -t -c "SHOW timezone;" 2>/dev/null | xargs)
        if [ $? -eq 0 ]; then
            echo "  Timezone: $PG_TZ"
            if [ "$PG_TZ" == "UTC" ]; then
                echo "  ✅ PostgreSQL está configurado en UTC"
            else
                echo "  ⚠️  PostgreSQL NO está en UTC"
            fi
            
            PG_TIME=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_NAME -t -c "SELECT NOW();" 2>/dev/null | xargs)
            echo "  Hora actual en BD: $PG_TIME"
            
            PG_TIME_UTC=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_NAME -t -c "SELECT NOW() AT TIME ZONE 'UTC';" 2>/dev/null | xargs)
            echo "  Hora en UTC: $PG_TIME_UTC"
        else
            echo "  ❌ No se pudo conectar a PostgreSQL"
        fi
    else
        echo "  ℹ️  psql no instalado, no se puede verificar"
    fi
    
    # Verificar variables de entorno del contenedor
    echo ""
    echo "  🐳 Variables de entorno del contenedor:"
    CONTAINER_TZ=$(docker exec ${POSTGRES_CONTAINER_NAME:-sisae-postgres} printenv TZ 2>/dev/null)
    if [ -z "$CONTAINER_TZ" ]; then
        echo "  ⚠️  TZ no configurada en el contenedor"
    else
        echo "  ✅ TZ: $CONTAINER_TZ"
    fi
    
    CONTAINER_PGTZ=$(docker exec ${POSTGRES_CONTAINER_NAME:-sisae-postgres} printenv PGTZ 2>/dev/null)
    if [ -z "$CONTAINER_PGTZ" ]; then
        echo "  ⚠️  PGTZ no configurada en el contenedor"
    else
        echo "  ✅ PGTZ: $CONTAINER_PGTZ"
    fi
else
    echo "  ❌ Contenedor no está corriendo"
fi

echo ""
echo "===================================="
echo ""
echo "📝 Recomendaciones:"
echo "  1. Configurar TZ=UTC en tu shell (~/.zshrc o ~/.bashrc)"
echo "  2. Asegurar que docker-compose.db.yml tiene TZ=UTC"
echo "  3. Asegurar que main.ts configura process.env.TZ = 'UTC'"
echo "  4. Todas las fechas en la BD deben ser TIMESTAMP WITH TIME ZONE"
echo ""
echo "✨ Verificación completa!"
