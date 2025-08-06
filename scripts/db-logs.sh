#!/bin/bash

# Script para ver los logs de la base de datos PostgreSQL
echo "📋 Mostrando logs de la base de datos PostgreSQL..."
echo "Presiona Ctrl+C para salir"
echo ""

docker-compose -f docker-compose.db.yml logs -f
