#!/bin/bash

# Script para detener Redis con Docker Compose
echo "🛑 Deteniendo Redis..."

# Verificar si Docker está ejecutándose
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está ejecutándose."
    exit 1
fi

# Detener Redis usando docker-compose
docker compose -f docker-compose.redis.yml down

# Verificar si Redis se detuvo correctamente
if [ $? -eq 0 ]; then
    echo "✅ Redis detenido exitosamente"
else
    echo "❌ Error al detener Redis"
    exit 1
fi
