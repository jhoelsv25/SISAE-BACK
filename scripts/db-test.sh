#!/bin/bash

# Script para verificar la conexión a la base de datos
echo "🔍 Testing database connection..."

# Verificar si Docker está ejecutándose
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está ejecutándose. Por favor, inicia Docker Desktop."
    exit 1
fi

# Verificar si el archivo .env existe
if [ ! -f ".env" ]; then
    echo "❌ Error: No se encontró el archivo .env"
    echo "💡 Copia .env.example como .env y configura las variables"
    exit 1
fi

# Cargar variables de entorno
source .env

# Verificar si el contenedor de la base de datos está ejecutándose
if ! docker ps | grep -q "$POSTGRES_CONTAINER_NAME"; then
    echo "⚠️ El contenedor de la base de datos no está ejecutándose"
    echo "🚀 Iniciando base de datos..."
    ./scripts/db-start.sh
    echo "⏳ Esperando que la base de datos esté lista..."
    sleep 5
fi

# Función para probar la conexión
test_connection() {
    echo "🔌 Probando conexión a PostgreSQL..."
    
    # Usar docker exec para probar la conexión
    if docker exec -e PGPASSWORD="$POSTGRES_PASSWORD" "$POSTGRES_CONTAINER_NAME" psql -h localhost -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT 1;" > /dev/null 2>&1; then
        echo "✅ Conexión a la base de datos exitosa!"
        
        # Obtener información de la base de datos
        echo "📊 Información de la base de datos:"
        docker exec -e PGPASSWORD="$POSTGRES_PASSWORD" "$POSTGRES_CONTAINER_NAME" psql -h localhost -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT version();" | head -3
        
        # Listar tablas existentes
        echo "📋 Tablas existentes:"
        TABLES=$(docker exec -e PGPASSWORD="$POSTGRES_PASSWORD" "$POSTGRES_CONTAINER_NAME" psql -h localhost -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ' | grep -v '^$')
        
        if [ -z "$TABLES" ]; then
            echo "   📭 No hay tablas creadas aún"
            echo "   💡 Esto es normal para una nueva instalación"
        else
            echo "$TABLES"
        fi
        
        echo ""
        echo "🎯 Parámetros de conexión para tu aplicación:"
        echo "   Host: localhost"
        echo "   Port: $POSTGRES_PORT"
        echo "   Database: $POSTGRES_DB"
        echo "   Username: $POSTGRES_USER"
        echo "   Password: [configurado en .env]"
        
        return 0
    else
        echo "❌ Error: No se pudo conectar a la base de datos"
        echo "🔧 Verificando estado del contenedor..."
        
        if docker ps | grep -q "$POSTGRES_CONTAINER_NAME"; then
            echo "✅ El contenedor está ejecutándose"
            echo "⏳ La base de datos podría estar iniciándose. Esperando 10 segundos..."
            sleep 10
            test_connection
        else
            echo "❌ El contenedor no está ejecutándose"
            echo "💡 Intenta: ./scripts/db-start.sh"
        fi
        
        return 1
    fi
}

# Ejecutar test de conexión
test_connection

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 ¡Base de datos lista para usar!"
    echo "🚀 Ahora puedes ejecutar: npm run start:dev"
else
    echo ""
    echo "❌ Problemas de conexión a la base de datos"
    echo "🔧 Pasos para solucionar:"
    echo "   1. Verifica que Docker esté ejecutándose"
    echo "   2. Ejecuta: ./scripts/db-start.sh"
    echo "   3. Espera unos segundos y vuelve a intentar"
    echo "   4. Verifica las credenciales en el archivo .env"
fi
