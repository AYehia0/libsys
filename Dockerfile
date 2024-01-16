# Stage 1: Build the app
FROM node:21.5.0-alpine3.18 AS build
WORKDIR /app

# copy nessary files to build the app with necessary scripts
COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src
COPY *.sh ./

# Install dependencies
RUN npm i

# Build the app
RUN npm run build

# Stage 2: Final image
FROM node:21.5.0-alpine3.18
WORKDIR /app

# Copy the build from the previous stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

# copy rest of the files, expect the ones in .dockerignore
COPY . .

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.12.1/wait /wait
RUN chmod +x /wait

# Set the NODE_ENV environment variable to production by default
ENV NODE_ENV=production

# Run the app with wait using the run.sh script
CMD ./run.sh $NODE_ENV
