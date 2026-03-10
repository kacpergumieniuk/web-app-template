/**
 * Reliable migration runner using drizzle-orm's migrate() directly.
 *
 * Bypasses `drizzle-kit migrate` CLI which has a known bug where it
 * reports "migrations applied successfully" but silently skips pending
 * migrations (drizzle-orm issue #5316).
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/migrate.ts
 *   npx tsx --env-file=.env.production.local scripts/migrate.ts
 */

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

// Direct connection (port 5432) required for DDL — pooler (6543) doesn't support it
const url = databaseUrl.replace(":6543/", ":5432/");
const sql = postgres(url, {
  max: 1,
  onnotice: () => {}, // Suppress "already exists, skipping" notices
});
const db = drizzle(sql);

async function run() {
  console.log("Running migrations...\n");

  const before = await sql`
    SELECT count(*)::int as cnt
    FROM drizzle.__drizzle_migrations
  `.catch(() => [{ cnt: 0 }]);

  await migrate(db, { migrationsFolder: "./drizzle" });

  const after = await sql`
    SELECT id, hash, created_at
    FROM drizzle.__drizzle_migrations
    ORDER BY created_at ASC
  `;

  const applied = after.length - Number(before[0].cnt);

  if (applied > 0) {
    console.log(`  ${applied} migration(s) applied.`);
  } else {
    console.log("  Already up to date.");
  }

  console.log(`  Total migrations in DB: ${after.length}`);
  console.log("\nDone.");
  await sql.end();
  process.exit(0);
}

run().catch(async (err) => {
  console.error("Migration failed:", err);
  await sql.end();
  process.exit(1);
});
