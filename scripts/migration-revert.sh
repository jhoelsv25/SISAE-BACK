#!/bin/bash

# Script para revertir la última migración
# Uso: ./scripts/migration-revert.sh [--prod]

set -e

echo "⏪ Revirtiendo última migración..."
echo ""

# Confirmar
read -p "⚠️  ¿Estás seguro de revertir la última migración? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelado"
    exit 1
fi

if [ "$1" == "--prod" ]; then
    echo "⚠️  Modo PRODUCCIÓN"
    NODE_ENV=production npm run migration:revert
else
    echo "🔧 Modo DESARROLLO"
    npm run migration:revert
fi

echo ""
echo "✅ Migración revertida!"
