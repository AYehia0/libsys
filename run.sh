#!/bin/sh

# Determine the appropriate command based on the environment
echo "Downloading wait script"
wget https://github.com/ufoscout/docker-compose-wait/releases/download/2.12.1/wait

chmod +x wait

echo "Running on $1"
if [ "$1" = "production" ]; then
    ./wait && npm run start
elif [ "$1" = "dev" ]; then
    ./wait && npm run dev
fi
