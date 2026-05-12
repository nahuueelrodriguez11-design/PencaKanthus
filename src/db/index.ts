import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// ============================================
// CLIENTE DE BASE DE DATOS — Serverless compatible
// Usa @neondatabase/serverless (HTTP) para
// funcionar en Netlify Functions / Edge
// ============================================

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("⚠️ DATABASE_URL is not set. Database queries will fail.");
}

// neon() crea un cliente HTTP serverless — la conexión se establece
// recién al ejecutar la primera query (lazy connection)
const sqlClient = neon(databaseUrl || "postgresql://placeholder");

// Drizzle ORM con driver neon-http
export const db = drizzle(sqlClient, { schema });
