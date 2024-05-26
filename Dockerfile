# Use the official Node.js 20 image.
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy all source files to the container
COPY . .

# Build the application
RUN yarn build
COPY ./src/storage ./dist/storage

# Expose the port the server uses
EXPOSE 8080

# Command to start the app
CMD ["yarn", "start"]
