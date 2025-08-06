#!/bin/bash

# Script para reiniciar la base de datos PostgreSQL
echo "🔄 Reiniciando base de datos PostgreSQL..."

echo "🛑 Deteniendo base de datos..."
docker-compose -f docker-compose.db.yml down

echo "🚀 Iniciando base de datos..."
docker-compose -f docker-compose.db.yml up -d

if [ $? -eq 0 ]; then
    echo "✅ Base de datos reiniciada correctamente"
    echo "📡 Conexión disponible en: localhost:5432"
else
    echo "❌ Error al reiniciar la base de datos"
    exit 1
fi
