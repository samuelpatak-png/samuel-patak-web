import { neon } from "@neondatabase/serverless";

type Sql = ReturnType<typeof neon>;

let sql: Sql | null = null;
let schemaReady: Promise<void> | null = null;

function createSql(): Sql {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  return neon(url);
}

export function getSql(): Sql {
  if (!sql) sql = createSql();
  return sql;
}

export async function ensureReviewsTable(): Promise<Sql> {
  const client = getSql();
  if (!schemaReady) {
    schemaReady = client`
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        company TEXT,
        body TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `.then(() => undefined);
  }
  await schemaReady;
  return client;
}
