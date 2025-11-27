# Student Management System

## Overview
A Next.js-based student management application for tracking students, teachers, books, and events. Built with React, TypeScript, and MongoDB.

**Project State**: Imported from GitHub and configured for Replit environment (November 27, 2025)

## Tech Stack
- **Frontend**: Next.js 15.1.6, React 18.3, TypeScript 5.1
- **UI Components**: Radix UI, Tailwind CSS
- **Database**: MongoDB
- **Authentication**: Simple admin auth with token-based system

## Project Structure
```
/app                 - Next.js app directory
  /api              - API routes (auth, students, teachers, books, events, stats)
  /dashboard        - Dashboard pages
  /login            - Login page
/components         - React components (UI components, dialogs, layouts)
  /ui               - Shadcn UI components
/lib                - Utility functions (auth, database, init)
/public             - Static assets
```

## Database Schema
MongoDB collections:
- **students**: Student records with email index
- **teachers**: Teacher records with email index
- **books**: Book records with ISBN index
- **events**: Calendar events (created via API)

## Configuration

### Environment Variables
- `MONGODB_URI`: MongoDB connection string (required)

### Dev Server
- Port: 5000
- Host: 0.0.0.0
- Already configured for Replit proxy with allowedDevOrigins

### Authentication
- Default admin credentials:
  - Username: `admin`
  - Password: `12345@Admin`

## Workflow
- **Start Application**: Runs `next dev -p 5000 -H 0.0.0.0`

## Key Features
- Student management (add, view, delete)
- Teacher management
- Book library tracking
- Event calendar
- Dashboard with statistics
- Modern PC-optimized design with sidebar navigation
- Responsive layout (sidebar on desktop, bottom nav on mobile)
- Dark mode support

## Recent Changes
- **2025-11-27**: PC-optimized UI redesign
  - Updated sidebar to show on md+ screens with modern slate/emerald design
  - Added menu item descriptions and Settings button to sidebar
  - Hidden bottom navigation on desktop (md+ screens)
  - Modernized data tables with search icon, improved empty states
  - Updated all dashboard pages with consistent modern design
  - Configured deployment settings for production (autoscale)

- **2025-11-27**: Initial import and Replit environment setup
  - Configured for port 5000 with 0.0.0.0 host
  - Next.js config already includes Replit allowedDevOrigins
  - Removed replit.md from .gitignore
  - Set up workflow for Next.js dev server

## User Preferences
- PC-first design with sidebar navigation (requested 2025-11-27)

## Notes
- MongoDB needs to be set up externally (MongoDB Atlas recommended)
- Application requires MONGODB_URI environment variable to run
