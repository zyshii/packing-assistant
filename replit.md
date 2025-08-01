# Overview

This is a modern travel packing list application built with React, Express, and TypeScript. The application helps users plan their trips by collecting trip details (destination, dates, activities) and generating intelligent packing recommendations based on weather conditions, activities, and trip types. The app features a multi-step onboarding flow, daily weather forecasts, clothing suggestions, and interactive packing lists with progress tracking.

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
- **Current Implementation**: In-memory storage for development (MemStorage class)
- **Schema Management**: Centralized schema definitions in `/shared/schema.ts`
- **Migration Support**: Drizzle Kit for database schema migrations
- **Data Persistence**: Client-side localStorage for trip data and user preferences

The storage interface allows easy switching between in-memory and database implementations without code changes.

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