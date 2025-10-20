import "dotenv/config";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

// Remove aspas da URL se existirem (caso estejam no .env)
const databaseUrl = process.env.DATABASE_URL?.replace(/^["']|["']$/g, "") || "";
const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
