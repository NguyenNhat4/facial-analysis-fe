# Environment Configuration

This project uses environment variables to configure the API connection and other settings.

## Setup

1. Copy the `.env.example` file to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your configuration:

   ```bash
   # API Configuration
   VITE_API_BASE_URL=http://localhost:3000/api

   # Development settings
   VITE_NODE_ENV=development

   # Optional: Enable/disable API connection check
   VITE_ENABLE_API_CHECK=true
   ```

## Environment Variables

### Required Variables

- **VITE_API_BASE_URL**: The base URL for the dental AI chatbot API
  - Default: `http://localhost:3000/api`
  - Example: `https://your-api-domain.com/api`

### Optional Variables

- **VITE_NODE_ENV**: Environment mode

  - Default: `development`
  - Options: `development`, `production`

- **VITE_ENABLE_API_CHECK**: Enable/disable API connection checks
  - Default: `true`
  - Set to `false` to skip API health checks and use demo mode

## Notes

- All frontend environment variables must be prefixed with `VITE_` for Vite to expose them to the client
- Changes to environment variables require restarting the development server
- The `.env` file is ignored by git for security reasons
- Use `.env.example` as a template for new environments

## API Server Setup

Before using the chat functionality with real AI responses, make sure to:

1. Navigate to the API directory: `cd chatbot/api`
2. Install dependencies: `npm install`
3. Copy API environment file: `cp .env.example .env`
4. Add your OpenAI API key to the API `.env` file
5. Start the API server: `npm run dev`

The API will be available at `http://localhost:3000` by default.
