import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers/columns";
import { user } from "./auth";

export const statusTable = pgTable("status", {
  status: text().primaryKey(),
});

export const mediaTypeTable = pgTable("media_type", {
  type: text().primaryKey(),
});

export const mediaTable = pgTable("media", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  title: text().notNull(),
  status: text()
    .references(() => statusTable.status)
    .notNull(),
  type: text()
    .references(() => mediaTypeTable.type)
    .notNull(),
  genre: text(),
  rating: integer(),
  startDate: timestamp({ mode: "date" }),
  completedDate: timestamp({ mode: "date" }),
  recommended: boolean(),
  comments: text().default(""),
  platform: text(),
  userId: text().references(() => user.id),
  isPrivate: boolean().default(false).notNull(),
  ...timestamps,
});

export type Media = typeof mediaTable.$inferSelect;
export type AddMedia = typeof mediaTable.$inferInsert;
