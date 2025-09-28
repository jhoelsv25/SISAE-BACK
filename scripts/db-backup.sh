USUARIO="jhoelsv"
BD="gestion_academica"
CONTENEDOR="sisae_postgres_db"
FECHA=$(date +%Y%m%d_%H%M%S)
RUTA="$HOME/Downloads"

set -e

mkdir -p "$RUTA"

docker exec -t $CONTENEDOR pg_dump -U $USUARIO -d $BD -F p > "$RUTA/${BD}_$FECHA.sql"

echo "✅ Backup generado en: $RUTA/${BD}_$FECHA.sql"