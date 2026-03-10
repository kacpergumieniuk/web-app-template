# CLAUDE.md

## Conventions

- Use `env` from `@/lib/env` — never `process.env` directly (exception: Supabase client files use `process.env.NEXT_PUBLIC_*` directly since they run before env validation)
- Shared Zod schemas in `lib/validations/` — one schema per domain, imported on both client and server
- Use `useAuth()` from `@/components/providers/auth-provider` in client components. Use `getSession()` from `@/lib/auth` in server components/actions
- All forms: React Hook Form + `zodResolver` + schemas from `lib/validations/`. Use shadcn `Form`/`FormField`/`FormItem`/`FormLabel`/`FormControl`/`FormMessage`
- Toasts via Sonner for success/info/errors. Inline validation via FormMessage. Cross-reload toasts use `useToastFlag()` hook from `lib/hooks/use-toast-flag.ts`
- `components/client-only.tsx` wrapper for Radix UI dropdowns/dialogs to prevent hydration mismatches
- Every `pgTable` must have `.enableRLS()`
- Buttons default to `variant="outline"` with `cursor-pointer`

## Server Actions

- All server actions go in `lib/actions/`. See `lib/actions/example.ts` for the pattern
- Always: `"use server"` → `getSession()` auth check → Zod `.parse(input)` → business logic → `revalidatePath()` → return `{ success: true }` or `{ error: "..." }`
- Never call DB or mutate data from client components directly — always go through server actions

## Forms

- Always use React Hook Form with `zodResolver` — never uncontrolled forms or manual state
- Schema in `lib/validations/`, form component uses `useForm<T>({ resolver: zodResolver(schema) })`
- Submit handler calls a server action, handles `{ error }` with `toast.error()`, `{ success }` with `toast.success()` or `useToastFlag()` if redirecting

## File Structure

- `lib/actions/` — server actions (one file per domain)
- `lib/hooks/` — custom React hooks
- `lib/validations/` — Zod schemas (one file per domain)
- `lib/db/` — Drizzle schema & client
- `lib/supabase/` — Supabase client/server/middleware
- `components/ui/` — shadcn components (auto-generated)
- `components/providers/` — context providers

## DB Workflow

- `db:generate` → `db:migrate` (NOT `db:push`). Migrations in `drizzle/`, committed to git
- `db:migrate` uses custom `scripts/migrate.ts` — NOT `drizzle-kit migrate` CLI (has a bug silently skipping migrations)
- Production: `npm run db:migrate:prod` (reads `.env.production.local`)

## Gotchas

- Drizzle: `prepare: false` required for Supabase connection pooler
- `drizzle.config.ts` swaps port 6543 → 5432 for DDL (pooler doesn't support DDL)
- Drizzle queries via `DATABASE_URL` bypass RLS; RLS only applies to Supabase JS client
- Supabase env vars are optional in `env.ts` — app works without auth when unset
- Middleware only protects `/dashboard/*` by default — extend `protectedPaths` array as needed

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Supabase Auth · Drizzle ORM · Zod · React Hook Form
