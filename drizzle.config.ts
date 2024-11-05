import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_DRIZZLE_DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in the environment variables");
}
export default defineConfig({
  schema: "./configs/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DRIZZLE_DATABASE_URL,
  },
});