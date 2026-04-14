# TaskFlow

A minimal but complete task management app built with React + TypeScript, featuring a Kanban board, drag & drop, dark mode, and real-time optimistic updates.

## Tech Stack
- React 18 + TypeScript
- Zustand (auth state management)
- React Router v6 (navigation + protected routes)
- MSW (Mock Service Worker) for API mocking
- shadcn/ui + Tailwind CSS v4
- @dnd-kit (drag and drop)
- react-hot-toast (notifications)
- Docker + Nginx (production build)

## Architecture Decisions
- **MSW** used for API mocking — works directly in browser, no extra server needed. Handlers mirror the exact API spec from Appendix A.
- **Zustand** over Redux — simpler for this scope, no boilerplate, persists auth state to localStorage.
- **Optimistic UI** for all task updates — status changes update immediately in UI, revert on API error with toast notification.
- **Protected routes** — `ProtectedRoute` wrapper redirects to `/login` if unauthenticated.
- **Component separation** — `TaskCard` extracted as standalone sortable component to keep `ProjectDetail` clean.
- **MSW handlers** maintain in-memory state across requests, simulating a real backend with relational data.
- Intentionally left out: real backend, WebSocket real-time updates, unit tests — out of scope for frontend-only role.

## Running Locally

```bash
git clone https://github.com/chhaya-shah/taskflow-chhaya-shah
cd taskflow-chhaya-shah
cp .env.example .env
npm install
npm run dev
```

App available at: http://localhost:5173

## Running with Docker

```bash
git clone https://github.com/chhaya-shah/taskflow-chhaya-shah
cd taskflow-chhaya-shah
cp .env.example .env
docker compose up
```

App available at: http://localhost:3000

## Running Migrations
No migrations required — this is a frontend-only project using MSW for API mocking. All data is seeded in `src/mocks/handlers.ts`.

## Test Credentials