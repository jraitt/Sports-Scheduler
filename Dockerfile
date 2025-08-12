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

# Build the application for production
RUN npm run build

# Expose port 3030
EXPOSE 3030

# Start the preview server (serves built files)
CMD ["npm", "run", "preview"]