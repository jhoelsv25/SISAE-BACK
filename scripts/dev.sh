#!/bin/bash

# Script para desarrollo completo: reset + start + seed + dev
# Uso: ./scripts/dev.sh

set -e

echo "🔄 Preparando entorno de desarrollo..."
echo ""

echo "1️⃣  Reseteando base de datos..."
./scripts/db-reset.sh

echo ""
echo "2️⃣  Iniciando base de datos..."
./scripts/db-start.sh

echo ""
echo "⏳ Esperando a que PostgreSQL esté listo..."
sleep 5

echo ""
echo "3️⃣  Ejecutando migraciones..."
npm run migration:run

echo ""
echo "4️⃣  Aplicando procedimientos..."
npm run db:procedures

echo ""
echo "5️⃣  Ejecutando seeds..."
npm run seed

echo ""
echo "✅ Base de datos lista!"
echo ""
echo "🚀 Iniciando aplicación en modo desarrollo..."
npm run start:dev
