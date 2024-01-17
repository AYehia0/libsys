#!/bin/bash

# This script is used to run all the tests in a docker container.
# tests in a test database. It is used by the CI system.

# run the dev docker-compose file with .env.test
docker-compose -f docker-compose.test.yml --env-file .test.env up -d --build

echo "Waiting for the database to be ready..."
./wait-for-it.sh -t 15 db:5432 -- echo "Database is ready!"

# run the tests
echo "Running tests..."
npm run test

# # stop the dev docker-compose file and clean up 
docker-compose -f docker-compose.test.yml down -v
