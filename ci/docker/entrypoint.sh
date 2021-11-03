#!/bin/sh

MIGRATION_DONE_FLAG=migration.done

if [ ! -f "${MIGRATION_DONE_FLAG}" ]; then
  echo "ENTRYPOINT: Running migration"
  npm run migration:run:prod && touch "${MIGRATION_DONE_FLAG}"
else
  echo "ENTRYPOINT: Skipping migration"
fi

npm run start:prod
