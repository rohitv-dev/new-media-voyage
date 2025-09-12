import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers/columns";
import { user } from "./auth";

export const notificationTypeTable = pgTable("notification_type", {
	type: text().primaryKey(),
});

export const notificationStatusTable = pgTable("notification_status", {
	status: text().primaryKey(),
});

export const notificationTable = pgTable("notification", {
	id: integer().generatedAlwaysAsIdentity().primaryKey(),
	title: text(),
	description: text(),
	actorId: text().references(() => user.id),
	for: text().references(() => user.id),
	type: text().references(() => notificationTypeTable.type),
	status: text().references(() => notificationStatusTable.status),
	archivedAt: timestamp({ mode: "date" }),
	archivedBy: text().references(() => user.id),
	archiveReason: text(),
	...timestamps,
});
