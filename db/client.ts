import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/*
  Server-only data clients. `db` is the typed Drizzle query builder for reads.
  `sql` is the raw postgres client used to invoke SECURITY DEFINER RPCs for
  writes (Doc 06 §5): the app never inserts into a table directly.
  In production DATABASE_URL points at Supabase; locally at the dev Postgres.
*/

const url = process.env.DATABASE_URL;

export const sql = url ? postgres(url, { max: 4 }) : null;
export const db = sql ? drizzle(sql, { schema }) : null;
