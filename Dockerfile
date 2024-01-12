FROM node:21.5.0-alpine3.18

WORKDIR /app

COPY . .

# Install dependencies
RUN npm i

# Build the app
RUN npm run build

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.12.1/wait /wait
RUN chmod +x /wait

# Expose the port
EXPOSE 3000

# Run the app with wait
CMD /wait && npm run start
