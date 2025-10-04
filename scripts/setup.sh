#!/bin/bash

# Script para setup inicial del proyecto
# Uso: ./scripts/setup.sh

set -e

echo "🚀 Setup Inicial SISAE-BACK"
echo "============================"
echo ""

# Check si existe .env
if [ ! -f ".env" ]; then
    echo "📝 Creando archivo .env..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Archivo .env creado desde .env.example"
        echo "⚠️  Por favor revisa y ajusta las variables en .env"
    else
        echo "❌ No se encontró .env.example"
        exit 1
    fi
else
    echo "✅ Archivo .env ya existe"
fi

echo ""
echo "📦 Instalando dependencias..."
npm install

echo ""
echo "🐳 Iniciando base de datos..."
./scripts/db-start.sh

echo ""
echo "⏳ Esperando a que PostgreSQL esté listo..."
sleep 5

echo ""
echo "🔄 Ejecutando migraciones..."
npm run migration:run

echo ""
echo "🌱 Ejecutando seeds..."
npm run seed

echo ""
echo "🔧 Aplicando procedimientos almacenados..."
npm run db:procedures

echo ""
echo "✅ Setup completo!"
echo ""
echo "Para iniciar la aplicación, ejecuta:"
echo "  npm run start:dev"
