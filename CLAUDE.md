# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ONMOIM is an event invitation creation, sharing, and participation survey web service. This is the frontend repository built with React 19, TypeScript, and Vite.

## Development Commands

```bash
# Development server (runs on port 3000)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Linting
npm run lint

# API Mock Server (using Prism CLI with OpenAPI spec)
npm run mock:api          # Static responses
npm run mock:api:dynamic  # Dynamic/faker responses
```

## Architecture Overview

### State Management Strategy

- **Server State**: TanStack Query (React Query) with aggressive caching (30min stale time, no refetch on window focus/mount)
- **Client State**: Zustand with localStorage persistence
  - Event creation draft state is managed by `useEventDraftStore` at [src/pages/EventCreate/store/useEventDraftStore.tsx](src/pages/EventCreate/store/useEventDraftStore.tsx)
  - Store handles field-level save operations and status tracking (idle/saving/error)
  - Date objects are serialized/deserialized automatically via `reviveDates` function in the store

### API Layer

- Centralized axios instance at [src/api/axiosInstance.ts](src/api/axiosInstance.ts)
- Base URL from `VITE_API_BASE_URL` environment variable (defaults to `http://localhost:4010` for mock server)
- Request interceptor adds JWT from localStorage to Authorization header
- Response interceptor handles 401 errors by clearing token and redirecting to `/login` after 5s delay
- Korean logging labels for each API endpoint (e.g., "회원가입", "행사 생성") for better debugging
- FormData detection in interceptors to properly handle multipart/form-data requests

### Authentication Flow

- JWT tokens stored in localStorage as `accessToken`
- 401 errors trigger automatic token removal and redirect to login (except on login/signup routes)
- Home route uses `HomeOrRedirectToLogin` component to check token before rendering
- Auth error details stored in `lastApiError` localStorage key for debugging

### Routing Structure

- React Router with nested routes under Layout wrapper
- Main routes:
  - `/` - Home (redirects to login if no token)
  - `/login` - Login page (no layout)
  - `/profile`, `/profile/:userId`, `/profile/edit` - Profile pages
  - `/profile/withdraw` - Account deletion (no layout)
  - `/event-create` - Event creation editor
  - `/event-create/preview` - Event preview
  - `/event-post/:eventId` - Event detail/post page
  - `/event-participants` - Event participants list
  - `/analysis` - Analytics dashboard

### Project Structure

```
src/
├── api/              # API client functions (auth, event, profile, analysis, comment)
├── components/       # Shared components
│   ├── common/       # Common UI components (NavBar, Layout, AlarmModal, etc.)
│   └── profile/      # Profile-specific components (social media modals)
├── pages/            # Feature-based page components
│   ├── Analysis/     # Analytics dashboard with charts (Recharts)
│   ├── EventCreate/  # Event creation with editor layout and modals
│   ├── EventPost/    # Event detail view
│   ├── Home/         # Main landing page
│   ├── Login/        # Authentication
│   └── Profile/      # User profile pages
├── hooks/            # Custom React hooks (useAuth, useProfile)
├── utils/            # Utility functions (imageCompression, formatDate, jwtDecoder)
├── constants/        # Type definitions and constants
├── openapi/          # OpenAPI spec (openapi.yaml) and mock data
└── styles/           # Global styles
```

## Key Technical Details

### Date Handling

When using Zustand persist with Date objects, they serialize to strings. Use a `reviveDates` function in `onRehydrateStorage` to convert strings back to Date objects:

```typescript
const reviveDates = (data: DraftData): DraftData => {
  const toDate = (v: any) => (typeof v === "string" ? new Date(v) : v);
  return {
    ...data,
    schedule: {
      startAt: data.schedule.startAt ? toDate(data.schedule.startAt) : null,
      endAt: data.schedule.endAt ? toDate(data.schedule.endAt) : null,
    },
  };
};
```

### Image Upload Handling

- Profile images and event covers use FormData for upload
- Axios interceptor automatically removes Content-Type header for FormData to let browser set correct boundary
- Image compression utility at [src/utils/imageCompression.ts](src/utils/imageCompression.ts)

### OpenAPI-Driven Development

- OpenAPI spec at [src/openapi/openapi.yaml](src/openapi/openapi.yaml)
- Mock server using Stoplight Prism CLI
- Mock data helpers in `src/openapi/mock*.ts` files
- Use mock server during development when backend is unavailable

## Team Conventions

### Branch Naming

Format: `{작업자}/{유형}/{작업-내용}`

- **작업자**: `chillpan`, `dobby`, `kaya`
- **유형**: `feat`, `design`, `fix`, `refactor`, `docs`
- **작업 내용**: lowercase with hyphens (e.g., `main-page-layout`)

Example: `chillpan/feat/analysis-chart`

### Commit Messages

Format: `[태그]: 설명`

- `feat`: New feature
- `fix`: Bug fix
- `design`: CSS/UI design changes
- `refactor`: Code refactoring (no behavior change)
- `chore`: Build tasks, package manager config
- `docs`: Documentation changes

Example: `feat: 메인 페이지 레이아웃 구현`

## Common Patterns

### Creating a New API Endpoint

1. Add function to appropriate file in `src/api/` (e.g., `event.ts`)
2. Add Korean label mapping in `axiosInstance.ts` `getApiLabel` function for better logging
3. Use TanStack Query hooks in components (`useQuery`, `useMutation`)

### Adding a New Page

1. Create page directory under `src/pages/PageName/`
2. Create `PageName.tsx` as main component
3. Add `components/` subdirectory for page-specific components
4. Add route to [src/App.tsx](src/App.tsx)
5. Consider if page needs Layout wrapper or standalone

### Working with Zustand Stores

- Create stores in feature directory (e.g., `src/pages/EventCreate/store/`)
- Use `persist` middleware for localStorage sync when needed
- Implement field-level status tracking (`idle`, `saving`, `error`) for form fields
- Provide separate setter and save functions for optimistic UI updates

### Styling with Tailwind

- Tailwind v4 with Vite plugin
- Global styles in [src/index.css](src/index.css)
- Use Headless UI for complex interactive components (dropdowns, modals)
