FROM node:21.5.0-alpine3.18

WORKDIR /app

COPY . .

# Install dependencies
RUN npm i

# Build the app
RUN npm run build

# Expose the port
EXPOSE 3000

# Run the app
CMD ["npm", "run", "start"]
