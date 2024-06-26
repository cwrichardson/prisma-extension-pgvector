#!/usr/bin/env bash
BASEDIR="$(cd "$(dirname "$0")/.." && pwd)"
SCRIPTSDIR="$BASEDIR/scripts"
SCHEMA="$BASEDIR/package/test/prisma/schema.prisma"
source $SCRIPTSDIR/setenv.sh
cd $BASEDIR/package/test && docker-compose up -d
echo '🟡 - Waiting for database to be ready...'
$SCRIPTSDIR/wait-for-it.sh "${DATABASE_URL}" -- echo '🟢 - Database is ready!'
cd $BASEDIR/package
pnpx prisma generate --schema $SCHEMA
pnpx prisma migrate deploy --schema $SCHEMA
pnpm test