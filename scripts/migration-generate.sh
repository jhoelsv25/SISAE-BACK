#!/bin/bash

# Script para generar migraciones de TypeORM
# Uso: ./scripts/migration-generate.sh NombreDeLaMigracion

if [ -z "$1" ]; then
  echo "Error: Debes proporcionar un nombre para la migración"
  echo "Uso: npm run migration:generate NombreDeLaMigracion"
  exit 1
fi

MIGRATION_NAME=$1

echo "Generando migración: $MIGRATION_NAME"
npx typeorm-ts-node-commonjs -d src/database/data-source.ts migration:generate "src/database/migrations/$MIGRATION_NAME"
