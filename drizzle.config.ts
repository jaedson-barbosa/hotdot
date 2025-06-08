import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  casing: 'snake_case',
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations/",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },
});
