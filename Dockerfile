# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port 3030
EXPOSE 3030

# Default command - will be overridden by docker-compose
CMD ["npm", "run", "dev"]