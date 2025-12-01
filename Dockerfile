# Use Node.js 18 (Railway's default, proven to work)
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy server directory
COPY server/ ./server/

# Copy rest of the application
COPY . .

# Build the frontend
RUN npm run build

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]

