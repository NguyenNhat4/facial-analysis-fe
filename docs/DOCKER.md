# Docker Setup for Dental AI UI

This project includes Docker configuration for both development and production environments.

## Files Created

- `Dockerfile` - Production build
- `Dockerfile.dev` - Development build
- `docker-compose.yml` - Production compose file
- `docker-compose.dev.yml` - Development compose file
- `.dockerignore` - Files to exclude from Docker build

## Production Build

### Using Docker Compose (Recommended)

```bash
# Build and run the production container
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# Stop the container
docker-compose down
```

### Using Docker directly

```bash
# Build the image
docker build -t dental-ai-ui .

# Run the container
docker run -p 4173:4173 dental-ai-ui
```

The application will be available at `http://localhost:4173`

## Development Build

### Using Docker Compose (Recommended)

```bash
# Build and run the development container
docker-compose -f docker-compose.dev.yml up --build

# Run in detached mode
docker-compose -f docker-compose.dev.yml up -d --build

# Stop the container
docker-compose -f docker-compose.dev.yml down
```

### Using Docker directly

```bash
# Build the development image
docker build -f Dockerfile.dev -t dental-ai-ui-dev .

# Run the development container
docker run -p 5173:5173 -v "$(pwd):/app" -v "/app/node_modules" dental-ai-ui-dev
```

The development server will be available at `http://localhost:5173` with hot reloading enabled.

## Environment Variables

The Docker setup uses the following environment variables:

- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:3000/api)
- `VITE_NODE_ENV` - Environment mode (development/production)
- `VITE_ENABLE_API_CHECK` - Enable API connection checks (true/false)

You can modify these in the `docker-compose.yml` or `docker-compose.dev.yml` files, or create a `.env` file.

## Connecting to Backend API

If you have a backend API running locally, you may need to:

1. Update `VITE_API_BASE_URL` to point to your backend
2. Use `host.docker.internal` instead of `localhost` when running on Windows/Mac:
   ```
   VITE_API_BASE_URL=http://host.docker.internal:3000/api
   ```
3. Or run both frontend and backend in the same Docker network

## Troubleshooting

### Port Already in Use

If you get a port conflict, change the port mapping in the docker-compose files:

```yaml
ports:
  - "8080:4173" # Changed from 4173:4173
```

### File Changes Not Reflected (Development)

Make sure the volume mounts are correct in `docker-compose.dev.yml`:

```yaml
volumes:
  - .:/app
  - /app/node_modules
```

### Build Failures

1. Clear Docker cache: `docker system prune -a`
2. Rebuild without cache: `docker-compose up --build --no-cache`
