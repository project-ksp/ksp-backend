# Stage 1: Building the app
FROM node:20-alpine as builder

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install npm dependencies
RUN npm ci

# Copy all source files to the container
COPY . .

# Build the application
RUN npm run build

# Stage 2: Setup the runtime environment
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy built files from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY ./src/storage ./dist/storage

# Copy only production node_modules (skip devDependencies)
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Expose the port the server uses
EXPOSE 3000

# Command to start the app
CMD ["node", "dist/index.js"]
