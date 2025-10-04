#!/bin/bash

# Script para crear migraciones vacías de TypeORM
# Uso: ./scripts/migration-create.sh NombreDeLaMigracion

if [ -z "$1" ]; then
  echo "Error: Debes proporcionar un nombre para la migración"
  echo "Uso: npm run migration:create NombreDeLaMigracion"
  exit 1
fi

MIGRATION_NAME=$1

echo "Creando migración: $MIGRATION_NAME"
npx typeorm-ts-node-commonjs -d src/database/data-source.ts migration:create "src/database/migrations/$MIGRATION_NAME"
