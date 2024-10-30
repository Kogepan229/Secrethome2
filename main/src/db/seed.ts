import { loadEnvConfig } from "@next/env";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import { adminTable } from "./schema";
import * as schema from "./schema";

loadEnvConfig(process.cwd(), true);

console.log("db_url:", process.env.DATABASE_URL);

async function main(): Promise<void> {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(pool, { logger: true, schema });

  const admin = await db.select().from(adminTable);
  if (admin.length === 0) {
    await db.insert(adminTable).values({ password: "admin" });
  } else {
    console.log("Admin data already exists.");
  }
}

main();
