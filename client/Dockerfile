# Base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Install dependencies using Yarn
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

# Copy all client files into the container
COPY . .

# Expose the port the app runs on
EXPOSE 5173

# Command to start the app using Yarn
CMD ["yarn", "dev"]
