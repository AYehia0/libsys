#!/bin/sh

# Determine the appropriate command based on the environment
echo "Downloading wait script"
wget https://github.com/ufoscout/docker-compose-wait/releases/download/2.12.1/wait

chmod +x wait

ls -la
if [ "$1" = "production" ]; then
    echo "Running on production server"
    ./wait && npm run start
else
    echo "Running on development"
    ./wait && npm run dev
fi
