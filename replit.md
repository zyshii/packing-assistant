# Overview

This is a modern travel packing list application built with React, Express, and TypeScript. The application helps users plan their trips by collecting trip details (destination, dates, activities) and generating intelligent packing recommendations based on real-time weather conditions, activities, and trip types. The app features a multi-step onboarding flow, daily weather forecasts with actual weather data from Open-Meteo API, clothing suggestions, and interactive packing lists with progress tracking.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built using React with TypeScript and follows a component-based architecture:

- **Framework**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks with localStorage for persistence, TanStack Query for server state
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Components**: Comprehensive set of accessible components from Radix UI

The application uses a modern design system with HSL color variables, ensuring WCAG AA compliance for accessibility. All semantic colors (success, info, warning, neutral) meet or exceed 4.5:1 contrast ratios for text and maintain proper contrast for interactive elements. Enhanced focus states and border visibility support keyboard navigation and screen readers.

## Backend Architecture

The backend follows a REST API pattern with Express.js:

- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Storage Interface**: Abstracted storage layer with in-memory implementation (expandable to database)
- **API Structure**: RESTful endpoints with `/api` prefix
- **Development**: Hot reload with Vite integration for seamless full-stack development

The server implements a clean separation between routing logic and storage operations through an interface-based approach.

## Data Storage Solutions

The application uses a flexible storage architecture:

- **Database ORM**: Drizzle ORM configured for PostgreSQL with schema definitions
- **Current Implementation**: PostgreSQL database with DatabaseStorage class (updated from in-memory storage)
- **Schema Management**: Centralized schema definitions in `/shared/schema.ts`
- **Migration Support**: Drizzle Kit for database schema migrations
- **Data Persistence**: PostgreSQL database for server data, client-side localStorage for trip data and user preferences

The storage interface allows easy switching between in-memory and database implementations without code changes. Database was integrated on August 1, 2025.

## External Dependencies

### Database & ORM
- **Neon Database**: Serverless PostgreSQL database (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe database queries and schema management
- **PostgreSQL**: Production database with session storage support

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **shadcn/ui**: Pre-built component library

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundler for production
- **React Hook Form**: Form state management with validation

### Client Libraries
- **TanStack Query**: Server state management and caching
- **React Router (Wouter)**: Lightweight routing solution
- **Date-fns**: Date manipulation utilities
- **Zod**: Runtime type validation

The architecture emphasizes type safety, accessibility, and developer experience while maintaining flexibility for future enhancements and database integration.

## Recent Changes (August 1, 2025)

### Weather API Integration
- **Real-time Weather Data**: Integrated Open-Meteo API for accurate weather forecasts
- **Weather Service**: Added `server/weatherService.ts` with comprehensive weather data fetching
- **Database Caching**: Added weather data caching in PostgreSQL to reduce API calls
- **API Endpoints**: 
  - `GET /api/weather` - Fetch weather forecast for location and date range
  - `GET /api/weather/cache/:location` - Access cached weather data
- **Frontend Integration**: Updated `client/src/pages/Index.tsx` to use real weather data
- **Enhanced UI**: Added UV index, precipitation data, and real-time data indicators
- **Error Handling**: Graceful fallback to estimated weather when API unavailable

### Location Compatibility Improvements
- **Smart Location Normalization**: Implemented intelligent location name processing to remove country suffixes (e.g., "Austin, USA" → "Austin")
- **Special Location Mappings**: Added custom mappings for destinations requiring specific search terms (e.g., "New York" → "New York City", "Grand Canyon" → "Grand Canyon Village Arizona")
- **Fallback Geocoding**: Automatic retry with city-only names when full location strings fail
- **Enhanced Logging**: Added detailed geocoding process logging for troubleshooting
- **100% Destination Compatibility**: All destinations in the app's predefined list now work with the weather API

### Technical Implementation
- **Schema Updates**: Added `weatherData` table with proper indexing for fast lookups
- **Data Validation**: Comprehensive Zod validation for API requests and responses (fixed boolean parameter handling)
- **Caching Strategy**: 6-hour cache duration with automatic refresh
- **Rate Limiting**: 14-day maximum date range to prevent API abuse
- **Weather Mapping**: Intelligent weather condition mapping from Open-Meteo codes
- **Temperature Conversion**: Automatic Celsius to Fahrenheit conversion for US users

The weather integration provides users with accurate, location-specific weather forecasts including temperature highs/lows, UV index, and precipitation data to improve packing recommendations. All app destinations now successfully retrieve real weather data.