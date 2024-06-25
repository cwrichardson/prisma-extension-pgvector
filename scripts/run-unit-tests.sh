#!/usr/bin/env bash
BASEDIR="$(cd "$(dirname "$0")/.." && pwd)"
SCRIPTSDIR="$BASEDIR/scripts"
source $SCRIPTSDIR/setenv.sh
cd $BASEDIR/package/test && docker-compose up -d
echo '🟡 - Waiting for database to be ready...'
$SCRIPTSDIR/wait-for-it.sh "${DATABASE_URL}" -- echo '🟢 - Database is ready!'
cd $BASEDIR/package && pnpm test