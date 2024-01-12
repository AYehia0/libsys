#!/bin/sh

# remove old build
rm -rf dist

# build
echo "Building..."
tsc

# copy the migration files to dist
cp -r src/database/migrations dist/database
