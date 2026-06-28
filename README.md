# TaskFlow
LIVE LINK: https://todo-l-afqm.vercel.app/
A task management app that doesn't suck.

Most "task trackers" you see in GitHub portfolios are the same CRUD tutorial with a fresh coat of paint. Create a task, check a box, delete it. That's not engineering — that's copy-pasting a tutorial and changing the font.

TaskFlow is different. It's designed like an actual SaaS product you'd use at work, not a homework assignment.

---

## What makes this different

**Real analytics, not just a counter.** The dashboard shows completion rates, priority breakdowns, overdue task tracking, and time-based trends. You can actually see where your time goes instead of guessing.

**Bulk operations that save time.** Select 12 tasks and mark them complete. Or delete them. Or export them to CSV. This sounds obvious, but most todo apps make you click one-by-one because they were built for demos, not real use.

**Optimistic UI.** When you mark a task complete, the UI updates instantly — no waiting for the server. If the server fails, it rolls back and tells you why. This is how Linear, Notion, and other polished apps work. Most todo apps wait for the network round-trip before showing anything.

**Keyboard shortcuts.** `Ctrl+N` for new task, `Ctrl+G` for grid view, `Ctrl+L` for list view. Power users shouldn't need a mouse.

**Debounced search.** Type in the search box and results update 300ms after you stop typing. No janky re-renders on every keystroke.

**A schema that actually makes sense.** Tasks have priority, status, category, due dates, and estimated hours. Not just "text + checkbox."

---

## Architecture

### Backend

I split the backend into the layers you'd find in a real production app:

- **Controllers** handle HTTP requests and responses. They don't touch the database directly.
- **Services** contain the actual business logic. The controller calls the service, the service does the work.
- **Routes** just wire URLs to controllers. No logic here.
- **Middlewares** handle cross-cutting concerns: request validation (Zod), rate limiting, error handling, CORS.
- **Models** define the Mongoose schema with indexes, validation, and timestamps.

This means if you need to change how tasks are created, you change the service. If you need to change the API shape, you change the controller. If the DB schema changes, only the model changes. Each layer has one job.

**Why this matters:** In a typical MERN tutorial, the route handler does validation, DB queries, and response formatting all in one function. That works for 3 endpoints. It falls apart at 30. TaskFlow has 10+ endpoints and the code stays readable because nothing is mashed together.

### Frontend

- **React Query (TanStack Query)** handles server state. Caching, background refetching, stale-while-revalidate, deduplication — all built-in. No manual `useEffect` + `fetch` spaghetti.
- **React Hook Form + Zod** for form validation. The form schema is shared with the backend, so validation rules are consistent on both sides.
- **Framer Motion** for transitions. Page transitions, card hover effects, modal animations, staggered list items. It's the difference between an app that feels like a website and one that feels like software.
- **Tailwind CSS** with custom design tokens. The color system, spacing scale, and animation keyframes are all defined in one config file. No random hex codes scattered through the codebase.

**The component hierarchy follows the same rule as the backend:**
- `common/` — reusable UI primitives (Button, Card, Modal, Badge, etc.)
- `dashboard/` — dashboard-specific components
- `tasks/` — task-specific components
- `layout/` — navbar, app shell
- `pages/` — route-level pages that compose everything together

No component is more than 250 lines. If it gets longer, it gets split.

---

## Why this stack

**React 19 + Vite** — Fast dev server, fast builds, minimal config. Vite's HMR is instant. Webpack isn't worth the pain for new projects anymore.

**TypeScript everywhere** — The backend and frontend share the same mental model. Enums, interfaces, and validation schemas are consistent. Type safety catches bugs before they reach production.

**MongoDB + Mongoose** — Document store fits the task model naturally. Mongoose gives you schema validation, middleware hooks, and query building without writing raw aggregation pipelines for basic CRUD.

**Express + Zod** — Express is boring and predictable. That's the point. Zod gives you runtime validation that matches your TypeScript types. If the frontend sends garbage, the backend rejects it before it touches the database.

---

## UX Decisions

**Dark mode by default.** The app starts in dark mode because most developers prefer it, and it looks better in screenshots. Light mode is available via the toggle in the navbar.

**Glassmorphism cards.** The card background is `bg-white/80` with `backdrop-blur-xl`. This gives depth without heavy drop shadows. The gradient overlay on the page background adds subtle visual interest without distracting from the content.

**Color-coded badges.** Priority and status are immediately scannable. Critical tasks are red. Completed tasks are green. Overdue tasks get a red "Overdue" banner on the card itself. You don't need to read dates to know something is wrong.

**Grid vs. List views.** Grid is better for browsing. List is better for bulk operations. The toggle is one click and the preference is immediate.

**Loading skeletons instead of spinners.** Skeletons show the shape of the content before it arrives. Spinners just say "wait." Skeletons feel faster.

**Empty states with actions.** When you have no tasks, the page shows an illustration and a "Create Task" button. Not a blank screen.

**Toast notifications.** Success and error messages appear in the bottom-right corner and auto-dismiss. They don't block the UI or require clicking "OK."

---

## Running locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Backend
```bash
cd backend
cp .env.example .env
# Add your MongoDB URI to .env
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Seed demo data
```bash
cd backend
npm run seed
```

The seed script generates 100+ tasks with realistic distributions across priorities, statuses, and categories. Some are overdue, some are due soon, some are completed. This lets you test every feature immediately without manually creating 50 tasks.

---

## Deployment

**Backend → Render**
- Create a new Web Service on Render
- Root Directory: `backend`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Add environment variables: `MONGODB_URI`, `CORS_ORIGIN`

**Frontend → Vercel**
- Import your GitHub repo
- Framework Preset: Vite
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Add environment variable: `VITE_API_URL` pointing to your Render backend URL

**Update CORS:** After the frontend deploys, go back to Render and set `CORS_ORIGIN` to your Vercel URL.

---

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API endpoint definitions
│   │   ├── middlewares/     # Validation, error handling, rate limiting
│   │   ├── models/          # Mongoose schemas
│   │   ├── validators/      # Zod schemas
│   │   ├── config/          # DB connection, env vars
│   │   ├── utils/           # Response helpers, async wrapper
│   │   └── types/           # Shared TypeScript types
│   ├── src/scripts/seed.ts  # Database seeding script
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/      # Reusable UI primitives
│   │   │   ├── dashboard/   # Dashboard widgets
│   │   │   ├── layout/      # Navbar, app shell
│   │   │   └── tasks/       # Task-specific components
│   │   ├── pages/           # Route-level pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── api/             # Axios service layer
│   │   ├── types/           # Shared TypeScript types
│   │   ├── utils/           # Helper functions
│   │   ├── constants/       # Colors, enums, options
│   │   ├── animations/      # Framer Motion variants
│   │   └── context/         # Theme and toast providers
│   └── package.json
├── .gitignore
├── render.yaml
└── README.md
```

---

## What's NOT in here (and why)

- **No authentication.** This is a portfolio piece, not a production SaaS. Adding auth would mean dealing with JWTs, password hashing, session management, and account recovery flows. That's a whole separate project. If you want auth, add Passport.js or Clerk and guard the routes.
- **No WebSockets.** Real-time updates are cool but overkill for a task tracker. React Query's background refetching gives you 90% of the benefit with 10% of the complexity.
- **No testing.** I know, I know. But this is already a large codebase for a single-repo portfolio piece. Adding a full test suite (Jest + React Testing Library + Supertest) would double the file count. The architecture is designed to be testable — services are pure functions, components are separated from data fetching — so tests can be added later without refactoring.

---

## License

MIT. Do whatever you want with it. Fork it, steal ideas from it, use it as a reference for your own projects. Just don't submit it as your own homework.

---

**Built with:** React 19, Vite, TypeScript, Tailwind CSS, Framer Motion, TanStack Query, Express, MongoDB, Mongoose, Zod.
