import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";

/**
 * Supabase Postgres via postgres.js driver.
 * prepare: false is required for Supabase connection pooler.
 *
 * Only initialize when DATABASE_URL is set — allows the app to run without DB.
 */
function createDb() {
  if (!env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Configure it in .env.local to use the database."
    );
  }

  const client = postgres(env.DATABASE_URL, {
    prepare: false,
    connect_timeout: 10,
    idle_timeout: 20,
  });

  return drizzle(client);
}

let _db: ReturnType<typeof createDb> | null = null;

export function getDb() {
  if (!_db) _db = createDb();
  return _db;
}

/** Direct access — throws if DATABASE_URL is unset */
export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getDb() as any)[prop];
  },
});
