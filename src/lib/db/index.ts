import { createServerOnlyFn } from "@tanstack/react-start";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env/server";

const driver = postgres(env.DATABASE_URL);

const getDatabase = createServerOnlyFn(() =>
	drizzle({ client: driver, casing: "snake_case" }),
);

export const db = getDatabase();
