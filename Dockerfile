# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy the rest of the application code
COPY . .

# Create .env file from example if it doesn't exist
RUN if [ ! -f .env ]; then cp .env.example .env; fi

# Build the application
RUN npm run build

# Expose port (Vite preview runs on 4173 by default)
EXPOSE 4173

# Start the application using Vite preview
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
