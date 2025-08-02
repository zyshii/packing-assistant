# Overview

This application is a modern travel packing list generator built with React, Express, and TypeScript. Its primary purpose is to help users plan trips by providing intelligent packing recommendations based on trip details, real-time weather conditions, planned activities, and trip types. Key capabilities include a multi-step onboarding process, daily weather forecasts, clothing suggestions, and interactive packing lists with progress tracking. The business vision is to provide a comprehensive, intuitive solution for stress-free travel preparation.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is a React application using TypeScript, built on a component-based architecture. It leverages Tailwind CSS with shadcn/ui for consistent styling, Wouter for lightweight routing, and React hooks with TanStack Query for state management and server state. Vite is used for fast development and optimized builds. The UI employs a modern design system with HSL color variables, ensuring WCAG AA compliance and enhanced accessibility through proper contrast ratios, focus states, and keyboard navigation support.

## Backend Architecture

The backend is a REST API developed with Node.js and Express.js, written in TypeScript. It features a clean separation between routing and an abstracted storage layer, currently implemented with PostgreSQL. The API follows a RESTful pattern with endpoints prefixed by `/api`.

## Data Storage Solutions

The application utilizes a flexible storage architecture centered around PostgreSQL. Drizzle ORM is used for type-safe database queries and schema management, with schema definitions centralized in `/shared/schema.ts` and Drizzle Kit for migrations. Data persistence is handled by PostgreSQL for server data and client-side localStorage for user preferences and trip-specific data.

## Key Features & Design Decisions

- **Intelligent Recommendation System**: A self-contained, dataset-based engine provides comprehensive packing recommendations. It intelligently weights suggestions based on weather conditions (temperature, UV, precipitation), activities (e.g., swimming, business, hiking), and luggage constraints. This system replaces external API dependencies for recommendations, ensuring reliability and cost-effectiveness.
- **Real-time Weather Integration**: Integrates with Open-Meteo API for accurate, location-specific weather forecasts. Weather data is cached in PostgreSQL to optimize API calls.
- **Smart Location Compatibility**: Implements intelligent location name processing for geocoding and includes custom mappings for specific destinations to ensure accurate weather data retrieval.
- **Modern Design System**: Features a clean, professional UI inspired by leading design principles, utilizing emoji-based category systems and streamlined information presentation. It prioritizes readability, mobile responsiveness, and reduced visual clutter.
- **Optimized Recommendation Logic**: The engine filters out inappropriate items based on weather, applies smart quantity optimization based on trip duration and luggage type (carry-on vs. checked), and provides practical footwear and activity-specific gear recommendations without over-packing.
- **Collapsible Daily Suggestions**: Daily clothing suggestions are presented in an accordion interface for improved scanability and user experience, with the first day expanded by default.

# External Dependencies

- **Database**: Neon Database (serverless PostgreSQL), PostgreSQL
- **ORM**: Drizzle ORM
- **UI & Styling**: Tailwind CSS, Radix UI, shadcn/ui, Lucide React
- **Build Tools**: Vite, TypeScript, ESBuild
- **Client Libraries**: TanStack Query, Wouter, Date-fns, Zod
- **APIs**: Open-Meteo API