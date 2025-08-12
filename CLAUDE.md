# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Basic Development
- `npm run dev` - Start development server (runs on host 0.0.0.0:3030)
- `npm run build` - Build production version  
- `npm run preview` - Preview production build

### Docker Development
- `docker-compose up --build` - Build and run containerized app
- `docker-compose logs` - View container logs
- Environment variables loaded from `.env` file

## Architecture Overview

### Technology Stack
- **Frontend:** React 18 with Vite build system
- **Styling:** Tailwind CSS with PostCSS
- **Icons:** Lucide React
- **Database:** Supabase (PostgreSQL)
- **State Management:** React hooks (useState, useEffect)

### Core Application Structure

The app is a single-page React application (`sports-scheduler.tsx`) that manages pickleball match scheduling with two main tabs:

1. **Schedule Tab** - View and manage scheduled matches
2. **Players Tab** - Add and manage player roster

### Data Architecture

**Database Tables:**
- `players` - Stores player information (name, skill level, phone)
- `matches` - Stores match details (date, time, court, player IDs as array)
- `courts` - Predefined court locations (Sue L, Hudson, Litchfield)

**API Layer (`src/supabase.js`):**
- `playersAPI` - CRUD operations for players
- `matchesAPI` - CRUD operations for matches  
- Uses Supabase client with Row Level Security policies

### Component Architecture

The main component (`PickleballScheduler`) contains:
- Modal-based match scheduling (`ScheduleMatchModal`)
- Inline editing forms (`EditMatchForm`, `EditPlayerForm`)
- Optimized forms with React.memo (`AddPlayerForm`)
- Error handling with localStorage fallback

### State Management Patterns

- Primary state managed via React hooks
- Async operations with try/catch error handling
- Optimistic UI updates followed by API calls
- Local state backup in localStorage for resilience

## Environment Setup

### Required Environment Variables
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup
1. Create Supabase project
2. Run `database-schema.sql` in Supabase SQL Editor
3. Configure environment variables in `.env` file

## Key Development Patterns

### Error Handling
All database operations use try/catch with user-friendly error messages and localStorage fallback for offline resilience.

### Performance Optimizations
- React.memo used for frequently re-rendered components
- useCallback for event handlers in memoized components
- Optimistic UI updates to maintain responsiveness

### Data Flow
1. Load initial data from Supabase on mount
2. Maintain local state for UI interactions
3. Sync changes to Supabase with error handling
4. Update local state on successful API responses

### UI Patterns
- Modal overlays for complex forms
- Inline editing with save/cancel actions
- Loading states and error boundaries
- Responsive grid layouts with Tailwind classes

## File Organization

- `sports-scheduler.tsx` - Main application component (single file architecture)
- `src/supabase.js` - Database API layer
- `src/main.jsx` - React app entry point
- `src/index.css` - Global styles and Tailwind imports
- `database-schema.sql` - Complete database schema
- `docker-compose.yml` - Container configuration