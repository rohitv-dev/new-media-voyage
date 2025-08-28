import { env } from "@/env/server";
import { serverOnly } from "@tanstack/react-start";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const driver = postgres(env.DATABASE_URL);

const getDatabase = serverOnly(() =>
  drizzle({ client: driver, casing: "snake_case" }),
);

export const db = getDatabase();