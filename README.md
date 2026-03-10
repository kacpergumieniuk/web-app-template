# Web App Template

Next.js 16 starter with Supabase Auth, Drizzle ORM, shadcn/ui, and Zod validation.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in your values
npm run dev
```

Auth/DB are optional — the app runs without Supabase env vars.

## Database (when needed)

1. Create a Supabase project
2. Fill `DATABASE_URL` and Supabase keys in `.env.local`
3. Run `supabase/setup.sql` in SQL Editor (triggers + RLS)
4. Generate & apply migrations:

```bash
npm run db:generate
npm run db:migrate
```

## Structure

```
app/                  — pages, layouts, error/loading/not-found
lib/actions/          — server actions ("use server" + Zod)
lib/hooks/            — custom React hooks
lib/validations/      — Zod schemas (one per domain)
lib/db/               — Drizzle schema & client
lib/supabase/         — Supabase client/server/middleware
lib/env.ts            — env validation (t3-oss)
lib/auth.ts           — getSession() server helper
components/ui/        — shadcn components
components/providers/ — AuthProvider + useAuth()
middleware.ts         — route protection (/dashboard/*)
scripts/migrate.ts    — migration runner
supabase/setup.sql    — triggers & RLS policies
```

## Patterns

- **Forms**: React Hook Form + `zodResolver` + shadcn Form components
- **Server actions**: `lib/actions/example.ts` — auth check, Zod parse, return `{ success }` or `{ error }`
- **Cross-reload toasts**: `useToastFlag("key", "message")` hook + `sessionStorage` flag
- **Error handling**: global `error.tsx`, `not-found.tsx`, `loading.tsx`

## Scripts

| Command | Description |
|---------|-------------|
| `dev` | Start dev server |
| `build` | Production build |
| `db:generate` | Generate Drizzle migrations |
| `db:migrate` | Apply migrations (dev) |
| `db:migrate:prod` | Apply migrations (prod) |
| `db:studio` | Open Drizzle Studio |
