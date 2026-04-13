# TaskFlow

A minimal task management app built with React + TypeScript.

## Tech Stack
- React 18 + TypeScript
- Zustand (auth state)
- React Router v6
- MSW (Mock Service Worker) for API mocking
- shadcn/ui + Tailwind CSS
- react-hot-toast

## Architecture Decisions
- **MSW** used for API mocking — works in browser, no extra server needed
- **Zustand** over Redux — simpler for this scope, no boilerplate
- **Optimistic UI** for task status changes — instant feedback, reverts on error
- **Protected routes** — redirect to /login if unauthenticated
- Auth state persists via localStorage across page refreshes

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
docker compose up
```

App available at: http://localhost:3000

## Test Credentials