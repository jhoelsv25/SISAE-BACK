#!/bin/bash

# Script para ejecutar todas las migraciones pendientes
# Uso: ./scripts/migration-run.sh [--prod]

set -e

echo "🔄 Ejecutando migraciones..."
echo ""

if [ "$1" == "--prod" ]; then
    echo "⚠️  Modo PRODUCCIÓN"
    NODE_ENV=production npm run migration:run
else
    echo "🔧 Modo DESARROLLO"
    npm run migration:run
fi

echo ""
echo "✅ Migraciones ejecutadas!"
