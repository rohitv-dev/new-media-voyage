import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers/columns";
import { user } from "./auth";

export const friendStatusTable = pgTable("friend_status", {
	status: text().primaryKey(),
});

export const friendTable = pgTable("friend", {
	id: integer().generatedAlwaysAsIdentity().primaryKey(),
	senderId: text()
		.references(() => user.id)
		.notNull(),
	receipientId: text()
		.references(() => user.id)
		.notNull(),
	status: text()
		.references(() => friendStatusTable.status)
		.notNull(),
	...timestamps,
});

export type FriendWithUser = typeof friendTable.$inferSelect & {
	user: {
		id: string;
		name: string;
		email: string;
	} | null;
};
