#!/bin/bash

# This script is used to run all the tests in a docker container.
# tests in a test database. It is used by the CI system.

# run the dev docker-compose file with .env.test
docker-compose -f docker-compose.test.yml --env-file .test.env up -d --build

# wait for PostgreSQL to be ready inside the container
until docker-compose -f docker-compose.test.yml exec -T db pg_isready -h localhost -p 5432; do
  >&2 echo "Postgres is not ready - sleeping"
  sleep 1
done

# run the tests
npm run test

# # stop the dev docker-compose file and clean up 
docker-compose -f docker-compose.test.yml down -v
