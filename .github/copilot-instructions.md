# KrishiBandhu/Gareeb Kisan - AI Copilot Instructions

## Project Overview

**KrishiBandhu** (also known as Gareeb Kisan) is a full-stack AI-powered smart farming platform designed for Indian farmers. The application provides crop advisory, weather alerts, mandi price predictions, marketplace, and community features with support for 10 major Indian languages.

## Architecture

### Frontend (`src/`)
- **Tech**: React 19 + TypeScript, Vite, Tailwind CSS, Framer Motion
- **Routing**: React Router v7 with nested routes under `/dashboard` via `DashboardLayout`
- **UI Components**: shadcn/ui pattern (Radix UI + CVA) in `src/components/ui/`
- **Layout**: Fixed navbar + collapsible sidebar (responsive), `DashboardLayout` wraps all authenticated pages
- **Data**: Currently uses mock data from `src/data/mockData.ts` - planned migration to API calls

### Backend (`server/`)
- **Tech**: Node.js + Express + TypeScript, MongoDB + Mongoose
- **Auth**: JWT-based (access + refresh tokens), middleware at `server/src/middleware/auth.ts`
- **Routes**: RESTful API at `/api/*` (auth, users, crops, marketplace, community, schemes)
- **Models**: Mongoose schemas in `server/src/models/` with pre-save hooks (e.g., password hashing)

### Key Integration Points
- **Weather**: OpenWeather API integration in `src/services/weatherService.ts` (API key embedded)
- **Mandi Prices**: Government of India API in `src/services/mandiService.ts` (API key: 579b464db66ec23bdd00000103b61ae65770414643985f03e5f9bbeb)
- **i18n**: i18next with 10 languages, auto-detection, localStorage persistence
- **Frontend-Backend**: CORS configured for `http://localhost:5173` (frontend) to `http://localhost:5000` (backend)

## Critical Developer Workflows

### Running the Project
```bash
# Frontend (from root)
npm install
npm run dev  # Runs on http://localhost:5173

# Backend (from server/)
cd server
npm install
npm run dev  # Runs on http://localhost:5000 (nodemon with TypeScript)
```

### Environment Setup
- **Frontend**: No `.env` file currently needed (API key hardcoded in weatherService.ts - consider moving to env)
- **Backend**: Copy `server/.env.example` to `server/.env` and configure:
  - `MONGODB_URI`: MongoDB connection (local or Atlas)
  - `JWT_SECRET` and `JWT_REFRESH_SECRET`: Generate secure random strings
  - `CORS_ORIGIN`: Frontend URL (default: `http://localhost:5173`)
  - Optional: `CLOUDINARY_*` for image uploads, `WEATHER_API_KEY`, `MANDI_API_KEY`

### Database
- MongoDB connection in `server/src/config/database.ts`
- Auto-creates collections on first document insert
- Models define schema validation and indexes

## Project-Specific Conventions

### Frontend Patterns

1. **Component Styling**: Always use the `cn()` utility from `src/lib/utils.ts` for className merging:
   ```tsx
   import { cn } from "@/lib/utils"
   
   <div className={cn("base-classes", conditionalClass && "conditional", className)} />
   ```

2. **UI Components (shadcn/ui pattern)**:
   - Located in `src/components/ui/`
   - Use `class-variance-authority` (CVA) for variant-based styling
   - Export both component and variant types
   - Example: `Badge`, `Button`, `Card` components

3. **Internationalization**:
   - Use `useTranslation()` hook in components:
     ```tsx
     import { useTranslation } from 'react-i18next'
     const { t } = useTranslation()
     return <h1>{t('dashboard.welcome')}</h1>
     ```
   - Translation keys in `src/locales/{lang}.json` (10 languages)
   - Language switcher via `LanguageSwitcher.tsx` component

4. **Color Palette** (nature-inspired):
   - Primary: `#22c55e` (green) - used for CTAs, active states
   - Secondary: Brown/yellow earth tones
   - Defined in `tailwind.config.js` with HSL CSS variables

5. **Data Fetching**:
   - Mock data in `src/data/mockData.ts` with TypeScript interfaces
   - Real API integration via `src/services/*` (weatherService as example)
   - **TODO**: Replace mock data imports with API calls when backend is ready

### Backend Patterns

1. **Route Structure**:
   - Routes in `server/src/routes/` define endpoints
   - Controllers in `server/src/controllers/` handle business logic
   - Middleware applied: `authenticate`, `authorize(['role'])`, `validate`

2. **Authentication Middleware**:
   - `authenticate`: Verify JWT, attach `req.user`
   - `authorize(...roles)`: Check user role (`farmer`, `buyer`, `admin`)
   - `optionalAuth`: Attach user if token present, don't fail if missing

3. **Error Handling**:
   - Centralized in `server/src/middleware/error.ts`
   - `notFound` middleware for 404s
   - `errorHandler` middleware returns consistent JSON error format
   - Different responses for development vs production (stack traces)

4. **Model Conventions**:
   - Export interfaces extending `Document` (e.g., `IUser`)
   - Pre-save hooks for data transformation (password hashing, timestamps)
   - Select-false for sensitive fields (`password`, `refreshToken`)
   - Instance methods for operations like `comparePassword()`

5. **Security**:
   - Helmet, CORS, rate limiting configured in `server/src/index.ts`
   - Rate limit: 100 requests per 15 minutes per IP on `/api/*`
   - Body size limit: 10mb

## Adding New Features

### New Frontend Page
1. Create page component in `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx` under `<Route path="/dashboard">` (for authenticated pages)
3. Add navigation link in `src/components/layout/Sidebar.tsx` (with icon from `lucide-react`)
4. Add translations to all 10 language files in `src/locales/`

### New Backend Endpoint
1. Create route file `server/src/routes/resource.ts`
2. Create controller `server/src/controllers/resourceController.ts`
3. Create model if needed `server/src/models/Resource.ts`
4. Register route in `server/src/index.ts`: `app.use('/api/resource', resourceRoutes)`
5. Add middleware: `authenticate`, `validate`, etc.

### New UI Component (shadcn/ui pattern)
1. Create component in `src/components/ui/component-name.tsx`
2. Use CVA for variants, forward refs for Radix components
3. Always use `cn()` utility for className composition
4. Export component and types (e.g., `ButtonProps extends VariantProps<typeof buttonVariants>`)

## Important Files & Directories

- **`src/App.tsx`**: Main routing configuration (React Router)
- **`src/i18n.ts`**: i18next initialization with 10 languages
- **`src/components/layout/DashboardLayout.tsx`**: Authenticated page wrapper
- **`server/src/index.ts`**: Express app initialization, middleware, route registration
- **`server/src/config/database.ts`**: MongoDB connection logic
- **`server/src/middleware/auth.ts`**: JWT authentication logic
- **`tailwind.config.js`**: Theme customization (colors, spacing)
- **`I18N_README.md`**: Complete i18n usage guide

## Known Gotchas

1. **Mock Data**: Frontend currently uses mock data. Check `src/data/mockData.ts` imports in pages before assuming real API integration.
2. **Weather API Key**: Hardcoded in `src/services/weatherService.ts` - should be moved to environment variable.
3. **MongoDB Connection**: Backend will exit with code 1 if MongoDB connection fails on startup.
4. **Language Persistence**: Language preference stored in `localStorage`, ensure to update on language change.
5. **Path Aliases**: Not configured. Use relative imports (`../../lib/utils`).
6. **Dual Package Names**: Project referred to as both "KrishiBandhu" and "Gareeb Kisan" - maintain consistency in new code.

## Testing & Build

```bash
# Frontend build (outputs to dist/)
npm run build
npm run preview  # Preview production build

# Backend build (compiles TypeScript to dist/)
cd server
npm run build
npm start  # Run compiled JS
```

No test suites currently configured (`npm test` script exists but not implemented).
