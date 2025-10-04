#!/bin/bash

# Script para iniciar la base de datos PostgreSQL con Docker Compose
echo "🚀 Iniciando base de datos PostgreSQL..."

# Verificar si el archivo .env existe
if [ ! -f ".env" ]; then
    echo "❌ Error: No se encontró el archivo .env"
    echo "💡 Copia .env.example como .env y configura las variables"
    exit 1
fi

# Cargar variables de entorno de forma segura
set -a
source .env 2>/dev/null
set +a

# Verificar si Docker está ejecutándose
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está ejecutándose. Por favor, inicia Docker Desktop."
    exit 1
fi

# Ejecutar docker-compose
docker-compose -f docker-compose.db.yml up -d

# Verificar si el contenedor se inició correctamente
if [ $? -eq 0 ]; then
    echo "✅ Base de datos PostgreSQL iniciada correctamente"
    echo "📡 Conexión disponible en: localhost:${POSTGRES_PORT:-5432}"
    echo "👤 Usuario: ${POSTGRES_USER}"
    echo "�️  Base de datos: ${POSTGRES_DB}"
    echo "� Contenedor: ${POSTGRES_CONTAINER_NAME}"
    echo ""
    echo "Para ver los logs: ./scripts/db-logs.sh"
    echo "Para detener: ./scripts/db-stop.sh"
else
    echo "❌ Error al iniciar la base de datos"
    exit 1
fi
