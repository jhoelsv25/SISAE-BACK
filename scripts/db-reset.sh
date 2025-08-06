#!/bin/bash

# Script para eliminar completamente la base de datos (incluyendo datos)
echo "⚠️  ADVERTENCIA: Este script eliminará TODOS los datos de la base de datos"
echo "¿Estás seguro de que quieres continuar? (y/N)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "🗑️  Eliminando base de datos y todos los datos..."
    docker-compose -f docker-compose.db.yml down -v
    
    if [ $? -eq 0 ]; then
        echo "✅ Base de datos y datos eliminados completamente"
    else
        echo "❌ Error al eliminar la base de datos"
        exit 1
    fi
else
    echo "❌ Operación cancelada"
fi
