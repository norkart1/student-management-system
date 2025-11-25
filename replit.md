# Student Management System - Replit Configuration

## Project Overview
A comprehensive Next.js-based student management system successfully migrated from Vercel to Replit. The application provides student, teacher, and academic management capabilities with MongoDB integration.

## Current Status
- ✅ Development server running successfully on port 5000
- ✅ Next.js 15.5.6 with React 18.3.1
- ✅ TailwindCSS v3.4.17 (downgraded from v4 for compatibility)
- ✅ MongoDB connection configured via environment variables
- ✅ All UI components rendering with proper styling

## Critical Configuration Details

### Environment Requirements
- **Port**: Must bind to `0.0.0.0:5000` (required for Replit web preview)
- **MongoDB**: Connection string stored in `MONGODB_URI` secret (already configured)
- **Node.js**: Using pnpm as package manager

### Version Downgrades (Critical for Replit Compatibility)

#### 1. Next.js: 16.0.0 → 15.5.6
- **Reason**: Next.js 16 uses Turbopack by default, which hangs during compilation in Replit environment
- **Fix**: Downgraded to Next.js 15 which uses webpack and compiles successfully
- **Impact**: Stable compilation, no hangs

#### 2. React: 19.2.0 → 18.3.1
- **Reason**: Next.js 15 requires React 18.x (React 19 is only compatible with Next.js 16+)
- **Fix**: Downgraded both react and react-dom to 18.3.1
- **Impact**: Full compatibility restored

#### 3. TailwindCSS: v4.1.9 → v3.4.17
- **Reason**: TailwindCSS v4 with `@import "tailwindcss"` syntax causes Next.js compilation crashes in Replit
- **Fix**: Downgraded to v3 with traditional `@tailwind` directives
- **Files Changed**:
  - `globals.css`: Changed from `@import "tailwindcss"` to `@tailwind base/components/utilities`
  - `postcss.config.mjs`: Changed from `@tailwindcss/postcss` to `tailwindcss` + `autoprefixer`
  - Created `tailwind.config.ts` with v3 configuration
- **Impact**: All styling now works perfectly, no compilation issues

### Build Configuration

#### next.config.mjs
```javascript
webpack: (config, { isServer }) => {
  if (isServer) {
    config.externals.push({
      '@mongodb-js/zstd': 'commonjs @mongodb-js/zstd',
      kerberos: 'commonjs kerberos',
      '@aws-sdk/credential-providers': 'commonjs @aws-sdk/credential-providers',
      'mongodb-client-encryption': 'commonjs mongodb-client-encryption',
      snappy: 'commonjs snappy',
      aws4: 'commonjs aws4',
    })
  }
  return config
}
```
This prevents build failures with MongoDB native dependencies.

## Architecture

### Database Layer
- **File**: `lib/db.ts`
- **Pattern**: Connection pooling with caching
- **Key Functions**:
  - `connectToDatabase()`: Establishes and caches MongoDB connection
  - `getDatabase()`: Returns cached database instance
- **Environment Variable**: `MONGODB_URI`

### Authentication
- **File**: `lib/auth.ts`
- **Type**: Simple token-based auth (currently admin/admin)
- **API Routes**:
  - `/api/auth/login`: POST - validates credentials, returns token
  - `/api/auth/verify`: GET - verifies token validity

### Database Initialization
- **File**: `lib/init-db.ts`
- **Function**: `initializeDatabase()` - creates collections with validation schemas
- **Collections**: students, teachers, classes, subjects, grades, exams, attendance, books

## Recent Changes (November 25, 2025)

1. **Port Configuration**: Configured dev server to bind to 0.0.0.0:5000 for Replit compatibility
2. **Next.js Downgrade**: Resolved Turbopack compilation hangs by downgrading to v15
3. **React Downgrade**: Ensured compatibility with Next.js 15
4. **TailwindCSS v4 → v3 Migration**: Fixed critical compilation crashes caused by v4 syntax
5. **Layout Simplification**: Removed Google Fonts imports to prevent compilation hangs
6. **Build Configuration**: Added webpack externals for MongoDB native dependencies

## Known Issues & Solutions

### Issue: Server exits during compilation at "○ Compiling /"
- **Root Cause**: TailwindCSS v4 `@import "tailwindcss"` syntax incompatible with Next.js 15 + Replit environment
- **Solution**: Downgraded to TailwindCSS v3 with traditional directives ✅ FIXED

### Issue: Turbopack compilation hangs
- **Root Cause**: Next.js 16 Turbopack incompatibility with Replit environment
- **Solution**: Downgraded to Next.js 15 (webpack) ✅ FIXED

## Development Workflow

### Starting the Server
```bash
pnpm run dev
```
Configured workflow: "Next.js Development Server" (auto-starts in Replit)

### Installing Dependencies
```bash
pnpm add <package-name>
pnpm add -D <dev-package>
```

### Database Management
- Development database accessible via Replit database tools
- Production database managed separately (not accessible via agent tools)

## User Preferences
- Clean, minimal code without unnecessary comments
- Security-first approach (no hardcoded credentials, use environment variables)
- Prefer simplicity over complexity

## Next Steps
- Test all CRUD operations for students, teachers, classes, etc.
- Verify MongoDB connection and data persistence
- Test authentication flow end-to-end
- Deploy to production when ready
