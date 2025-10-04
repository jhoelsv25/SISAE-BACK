#!/bin/bash

# Script para aplicar procedimientos almacenados a la base de datos
# Uso: ./scripts/db-procedures.sh

set -e

echo "🔧 Aplicando procedimientos almacenados..."

# Cargar variables de entorno de forma segura
if [ -f .env ]; then
    set -a
    source .env 2>/dev/null
    set +a
fi

# Configuración de la base de datos
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_USERNAME=${DB_USERNAME:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres}
DB_NAME=${DB_NAME:-sisae_db}

# Directorio de procedimientos
PROCEDURES_DIR="src/database/procedures"

# Exportar la contraseña para psql
export PGPASSWORD=$DB_PASSWORD

echo "📁 Buscando archivos SQL en $PROCEDURES_DIR..."

# Ejecutar cada archivo SQL en el directorio
for sql_file in $PROCEDURES_DIR/*.sql; do
    if [ -f "$sql_file" ]; then
        echo "  ⚙️  Ejecutando: $(basename $sql_file)"
        psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_NAME -f "$sql_file"
        if [ $? -eq 0 ]; then
            echo "  ✅ $(basename $sql_file) aplicado correctamente"
        else
            echo "  ❌ Error al aplicar $(basename $sql_file)"
            exit 1
        fi
    fi
done

echo "✨ Todos los procedimientos fueron aplicados correctamente!"
