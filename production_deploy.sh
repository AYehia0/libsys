#!/bin/bash

echo "Fetching latest code from github"
git pull origin production

echo "Stopping Docker Compose"
docker-compose -f docker-compose.prod.yml down

echo "Running Docker Compose"
docker-compose -f docker-compose.prod.yml --env-file .prod.env up -d --build
