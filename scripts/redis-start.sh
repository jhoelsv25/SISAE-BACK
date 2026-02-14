#!/bin/bash

# Script para iniciar Redis con Docker Compose
echo "🚀 Iniciando Redis..."

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

# Iniciar Redis usando docker-compose
docker compose -f docker-compose.redis.yml up -d

# Verificar si Redis se inició correctamente
if [ $? -eq 0 ]; then
    echo "✅ Redis iniciado exitosamente"
    echo "📍 Host: ${REDIS_HOST}"
    echo "📍 Puerto: ${REDIS_PORT}"
    sleep 2
    
    # Verificar conexión a Redis
    docker exec redis-academico redis-cli -a "${REDIS_PASSWORD}" ping > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ Conexión a Redis verificada"
    else
        echo "⚠️  Redis está corriendo pero aún no responde. Espera unos segundos e intenta de nuevo."
    fi
else
    echo "❌ Error al iniciar Redis"
    exit 1
fi
