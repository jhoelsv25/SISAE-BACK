#!/bin/bash

# Script para verificar el estado de la base de datos y aplicación
# Uso: ./scripts/health-check.sh

echo "🏥 Sistema de Salud SISAE-BACK"
echo "================================"
echo ""

# Cargar variables de entorno de forma segura
if [ -f .env ]; then
    set -a
    source .env 2>/dev/null
    set +a
fi

DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
APP_PORT=${PORT:-3000}

# Check 1: Docker
echo "🐳 Docker:"
if command -v docker &> /dev/null; then
    echo "  ✅ Docker instalado: $(docker --version | cut -d' ' -f3)"
else
    echo "  ❌ Docker no está instalado"
fi

# Check 2: Docker Compose
echo ""
echo "🐙 Docker Compose:"
if command -v docker-compose &> /dev/null; then
    echo "  ✅ Docker Compose instalado: $(docker-compose --version | cut -d' ' -f4)"
else
    echo "  ❌ Docker Compose no está instalado"
fi

# Check 3: PostgreSQL Container
echo ""
echo "🗄️  Base de Datos PostgreSQL:"
if docker-compose -f docker-compose.db.yml ps 2>/dev/null | grep -q "Up"; then
    echo "  ✅ Contenedor corriendo"
    
    # Check connection
    export PGPASSWORD=${DB_PASSWORD:-postgres}
    if command -v psql &> /dev/null; then
        if psql -h $DB_HOST -p $DB_PORT -U ${DB_USERNAME:-postgres} -d ${DB_NAME:-sisae_db} -c '\q' 2>/dev/null; then
            echo "  ✅ Conexión exitosa"
        else
            echo "  ⚠️  Contenedor corriendo pero no responde (verifica credenciales)"
        fi
    else
        echo "  ℹ️  psql no instalado, no se puede verificar conexión"
    fi
else
    echo "  ❌ Contenedor detenido"
fi

# Check 4: Node.js
echo ""
echo "📦 Node.js:"
if command -v node &> /dev/null; then
    echo "  ✅ Node.js instalado: $(node --version)"
else
    echo "  ❌ Node.js no está instalado"
fi

# Check 5: npm packages
echo ""
echo "📚 Dependencias:"
if [ -d "node_modules" ]; then
    echo "  ✅ node_modules instalado"
else
    echo "  ⚠️  node_modules no encontrado (ejecuta: npm install)"
fi

# Check 6: Aplicación
echo ""
echo "🚀 Aplicación NestJS:"
if lsof -ti:$APP_PORT &> /dev/null; then
    echo "  ✅ Aplicación corriendo en puerto $APP_PORT"
else
    echo "  ⏸️  Aplicación no está corriendo"
fi

# Check 7: Archivo .env
echo ""
echo "⚙️  Configuración:"
if [ -f ".env" ]; then
    echo "  ✅ Archivo .env existe"
else
    echo "  ❌ Archivo .env no encontrado"
fi

# Check 8: Migraciones
echo ""
echo "🔄 Migraciones:"
if [ -d "src/database/migrations" ]; then
    migration_count=$(find src/database/migrations -name "*.ts" -not -name "*.example" | wc -l | xargs)
    echo "  ✅ Carpeta de migraciones existe ($migration_count archivos)"
else
    echo "  ⚠️  Carpeta de migraciones no encontrada"
fi

# Check 9: Procedimientos
echo ""
echo "🔧 Procedimientos:"
if [ -d "src/database/procedures" ]; then
    proc_count=$(find src/database/procedures -name "*.sql" | wc -l | xargs)
    echo "  ✅ Carpeta de procedimientos existe ($proc_count archivos)"
else
    echo "  ⚠️  Carpeta de procedimientos no encontrada"
fi

echo ""
echo "================================"
echo "✨ Revisión completa!"
