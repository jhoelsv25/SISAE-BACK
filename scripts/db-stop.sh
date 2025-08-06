#!/bin/bash

# Script para detener la base de datos PostgreSQL
echo "🛑 Deteniendo base de datos PostgreSQL..."

docker-compose -f docker-compose.db.yml down

if [ $? -eq 0 ]; then
    echo "✅ Base de datos detenida correctamente"
else
    echo "❌ Error al detener la base de datos"
    exit 1
fi
