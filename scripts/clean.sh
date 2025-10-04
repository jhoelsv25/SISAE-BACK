#!/bin/bash

# Script para limpiar el proyecto completamente
# Uso: ./scripts/clean.sh

echo "🧹 Limpiando proyecto..."
echo ""

# Confirmar
read -p "⚠️  Esto eliminará node_modules, dist, coverage, y la base de datos. ¿Continuar? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelado"
    exit 1
fi

echo ""
echo "🗑️  Eliminando node_modules..."
rm -rf node_modules

echo "🗑️  Eliminando dist..."
rm -rf dist

echo "🗑️  Eliminando coverage..."
rm -rf coverage

echo "🗑️  Eliminando .next (si existe)..."
rm -rf .next

echo "🗑️  Limpiando cache de npm..."
npm cache clean --force

echo "🗄️  Reseteando base de datos..."
./scripts/db-reset.sh

echo ""
echo "✅ Proyecto limpio!"
echo ""
echo "Para reinstalar, ejecuta:"
echo "  ./scripts/setup.sh"
