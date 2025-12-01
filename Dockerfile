# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy all package files first (for better Docker caching)
COPY package.json package-lock.json ./
COPY server/package.json server/package-lock.json ./server/

# Install root dependencies (including devDependencies for build)
# Use --legacy-peer-deps because some packages don't support React 19 yet
RUN npm ci --legacy-peer-deps

# Install server dependencies
RUN cd server && npm ci --legacy-peer-deps

# Copy source files (node_modules excluded via .dockerignore)
COPY . .

# Build the frontend (TypeScript + Vite)
RUN npm run build

# Set production environment
ENV NODE_ENV=production

# Expose port (Railway uses PORT env var)
EXPOSE 3000

# Start the server
CMD ["node", "server/index.js"]
