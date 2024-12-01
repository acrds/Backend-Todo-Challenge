#!/bin/bash

echo "Running migrations..."
npx typeorm-ts-node-commonjs migration:run -d ./src/data-source.ts

echo "Starting the application..."
exec "$@"
