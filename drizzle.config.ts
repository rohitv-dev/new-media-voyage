import type { Config } from "drizzle-kit";
import { env } from "./src/env/server"

export default {
  out: "./drizzle",
  schema: "./src/lib/db/schemas/*",
  breakpoints: true,
  verbose: true,
  strict: true,
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;