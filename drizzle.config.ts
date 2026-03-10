import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

// Supabase transaction pooler (port 6543) doesn't support DDL.
// Swap to the direct connection (port 5432) for drizzle-kit operations.
const url = process.env.DATABASE_URL!.replace(":6543/", ":5432/");

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
  schemaFilter: ["public"],
  entities: {
    roles: {
      provider: "supabase",
    },
  },
});
