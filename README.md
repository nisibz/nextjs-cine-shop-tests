# Cine Shop App

A modern e-commerce application for movie enthusiasts

## Features

- Movie search functionality powered by TMDB API
- Shopping cart system with local storage persistence
- Responsive UI built with Material UI components
- Docker support for both development and production
- Cart price calculations with discounts for bulk purchases
- Environment variables configuration for API keys

## Endpoint

### 🎥 Main Application (`/`)

**File:** `app/page.tsx`

**Features:**

- 🔍 Interactive movie search with debouncing
- 🖼️ Responsive movie card grid display
- 🛒 Cart management with local storage
  - Bulk discounts (3+ items)
  - Cart drawer interface
- 💳 Integrated QR payment system
  - 60-second timeout functionality
  - Automatic transaction expiration

### 🔒 Admin Dashboard (`/admin`)

**File:** `app/admin/page.tsx`

**Features:**

- 📊 Movie price management table
- 🔎 Full-text search across catalog
- ✏️ Direct price editing with persistence
- 📑 Paginated results

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm
- Docker (optional)

### Installation

Clone this repository:

```bash
git clone https://github.com/nisibz/nextjs-cine-shop-tests.git
cd nextjs-cine-shop-tests
```

## Environment Variables

Create a `.env` file with the following command:

```bash
cp .env.example .env
```

You can obtain a TMDB API key by creating an account at [https://www.themoviedb.org/](https://www.themoviedb.org/)

## Development Mode

### Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Docker Development Setup

1. Build the development Docker image:

   ```bash
   docker build -t nextjs-cine-shop:dev .
   ```

2. Run the container with volume mounting for live code updates:

   ```bash
   docker run -v $(pwd):/app -p 3000:3000 --name nextjs-cine-shop-dev nextjs-cine-shop:dev
   ```

3. Access the application at [http://localhost:3000](http://localhost:3000)

## Production Mode

### Local Production Setup

1. Create an optimized production build:

   ```bash
   npm run build
   ```

2. Start the production server:

   ```bash
   npm start
   ```

3. Access the application at [http://localhost:3000](http://localhost:3000)

### Docker Production Setup

1. Build the production Docker image:

   ```bash
   docker build -t nextjs-cine-shop:prod -f Dockerfile.prod .
   ```

2. Run the production container:

   ```bash
   docker run -p 3000:3000 --name nextjs-cine-shop-prod nextjs-cine-shop:prod
   ```

3. Access the application at [http://localhost:3000](http://localhost:3000)

## Technology Stack

- Next.js - React framework
- Material UI (MUI) - Component library
- TMDB API - Movie database
- Docker - Containerization

## License

This project is licensed under the MIT License
