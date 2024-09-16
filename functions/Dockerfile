# Base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Install dependencies using Yarn
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

# Copy all server files into the container
COPY . .

# Expose the port where Apollo Server will run
EXPOSE 4000

# Command to start Apollo Server using Yarn
CMD ["yarn", "start"]
