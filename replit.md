# Student Management System

## Overview

The Student Management System is a comprehensive web application built with Next.js 14 that provides a platform for managing students, teachers, books, and academic events. The application features a modern, responsive interface with role-based access control and a calendar-based event management system.

The system enables administrators to perform CRUD operations on educational resources, track academic schedules, and maintain records for students, teachers, and library books in a centralized platform.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & UI Library**
- **Next.js 14 App Router**: Utilizes the latest Next.js with server and client components architecture
- **React Server Components**: Leverages RSC for improved performance and data fetching
- **shadcn/ui Components**: Built on Radix UI primitives with Tailwind CSS styling
- **Theme System**: Custom design tokens using OKLCH color space with dark mode support via next-themes

**Routing Strategy**
- App Router with file-based routing structure
- Protected routes wrapped in authentication middleware via client-side checks
- Route groups for organized dashboard sections (`/dashboard/*`)

**State Management**
- Client-side state using React hooks (useState, useEffect)
- No external state management library - relies on prop drilling and local component state
- Authentication state persisted in localStorage and verified via API calls

**Styling Approach**
- Tailwind CSS with custom configuration
- CSS custom properties for theming
- Responsive design with mobile-first approach
- Bottom navigation for mobile, sidebar for desktop

### Backend Architecture

**API Design**
- Next.js API Routes (App Router route handlers)
- RESTful endpoints organized by resource type
- Route structure follows `/api/[resource]` and `/api/[resource]/[id]` patterns
- No middleware layer - authentication checked per-route basis

**Authentication Mechanism**
- Simple Base64 token-based authentication (not production-ready)
- Hardcoded admin credentials (username: "admin", password: "12345@Admin")
- Token stored in localStorage on client
- Token validated on API routes by decoding and checking username
- **Security Note**: This is a basic implementation not suitable for production use

**Data Access Layer**
- Direct MongoDB driver usage without ORM
- Connection pooling via cached client/database instances
- Collections: students, teachers, books, events
- Basic indexes on email fields for students/teachers and ISBN for books

**Calendar Event Management**
- Timezone-agnostic event system using YYYY-MM-DD date format
- Events stored as calendar days (not timestamps) to prevent timezone issues
- RESTful API endpoints: GET, POST, PUT, DELETE at `/api/events` and `/api/events/[id]`
- Event types: general, holiday, exam, meeting, sports
- Interactive calendar UI with event indicators (dots on dates with events)
- Event filtering by month with automatic refetching on navigation
- Fully controlled calendar component with parent state management
- Calendar accessible via bottom navigation (mobile) with teal-themed icon

### External Dependencies

**Database**
- **MongoDB**: Primary data store via native MongoDB driver
- Connection string expected in `MONGODB_URI` environment variable
- Default fallback: `mongodb://localhost:27017/student_management`
- Collections created on-demand with basic indexing

**Third-Party Services**
- **Vercel Analytics**: Integrated for usage tracking and performance monitoring
- **Google Fonts**: Geist and Geist Mono fonts loaded from Google Fonts CDN

**UI Component Libraries**
- **Radix UI**: Comprehensive set of unstyled, accessible components
  - Dialog, Dropdown Menu, Checkbox, Calendar components, etc.
  - Provides accessibility and keyboard navigation out of the box
- **Lucide React**: Icon library for consistent iconography
- **class-variance-authority**: Utility for managing component variants
- **tailwind-merge + clsx**: Class name merging utilities

**Development Dependencies**
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling with `tw-animate-css` plugin

**Notable Architectural Decisions**

1. **Database Choice**: MongoDB selected for flexible schema and rapid development without migrations
2. **Authentication**: Simple token-based auth chosen for prototype speed, should be replaced with NextAuth.js or similar for production
3. **No ORM/Query Builder**: Direct MongoDB driver usage provides flexibility but lacks type safety for queries
4. **Client-Side Routing Protection**: Authentication checks happen on client and per-API route rather than middleware layer
5. **Component Library**: shadcn/ui chosen for customizable, copy-paste components rather than heavyweight UI framework
6. **Date Storage Format**: Calendar events use YYYY-MM-DD string format instead of ISO timestamps to eliminate timezone-related bugs and ensure consistent date rendering across all locales

## Recent Changes (November 22, 2025)

**Calendar Event Management System**
- Implemented full CRUD operations for calendar events
- Created timezone-safe date handling using YYYY-MM-DD format
- Added event indicators on calendar (small dots on dates with events)
- Calendar navigation automatically fetches events for the displayed month
- Events can be created with title, description, and categorized by type
- Event deletion with immediate UI refresh
- Calendar icon already present in bottom navigation bar for quick access