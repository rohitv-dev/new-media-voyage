import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, sql } from "drizzle-orm";
import { authMiddleware } from "@/lib/auth/middleware";
import { db } from "@/lib/db";
import { notificationTable } from "@/lib/db/schemas/notification";

export const fetchUnreadNotifCount = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async (ctx) => {
		try {
			const { id } = ctx.context.user;

			const data = await db
				.select({
					count: sql<number>`count(*)`.mapWith(Number),
				})
				.from(notificationTable)
				.where(
					and(
						eq(notificationTable.for, id),
						eq(notificationTable.status, "Unread"),
					),
				);

			return data[0];
		} catch (err) {
			console.log("Error fetching unread notification count: ", err);
			throw new Error("Failed to fetch unread notification count");
		}
	});

export const fetchReadNotifications = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async (ctx) => {
		try {
			const { id } = ctx.context.user;

			const data = await db
				.select()
				.from(notificationTable)
				.where(
					and(
						eq(notificationTable.for, id),
						eq(notificationTable.status, "Read"),
					),
				)
				.orderBy(desc(notificationTable.createdAt))
				.limit(10);

			return data;
		} catch (err) {
			console.log("Error fetching unread notifications: ", err);
			throw new Error("Failed to fetch unread notifications");
		}
	});

export const fetchUnreadNotifications = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async (ctx) => {
		try {
			const { id } = ctx.context.user;

			const data = await db
				.select()
				.from(notificationTable)
				.where(
					and(
						eq(notificationTable.for, id),
						eq(notificationTable.status, "Unread"),
					),
				)
				.orderBy(desc(notificationTable.createdAt));

			return data;
		} catch (err) {
			console.log("Error fetching unread notifications: ", err);
			throw new Error("Failed to fetch unread notifications");
		}
	});

export const markNotifAsRead = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((id: number) => id)
	.handler(async (ctx) => {
		try {
			const { id } = ctx.context.user;

			await db
				.update(notificationTable)
				.set({
					status: "Read",
				})
				.where(
					and(
						eq(notificationTable.id, ctx.data),
						eq(notificationTable.for, id),
						eq(notificationTable.status, "Unread"),
					),
				);
		} catch (err) {
			console.log("Error marking notification as read: ", err);
			throw new Error("Failed to mark notification as read");
		}
	});

export const archiveNotification = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((input: { id: number; reason: string }) => input)
	.handler(async (ctx) => {
		try {
			const { id } = ctx.context.user;
			const { id: notificationId, reason } = ctx.data;

			await db
				.update(notificationTable)
				.set({
					archivedAt: new Date(),
					archivedBy: id,
					archiveReason: reason,
					status: "Archived",
				})
				.where(
					and(
						eq(notificationTable.id, notificationId),
						eq(notificationTable.for, id),
					),
				);
		} catch (err) {
			console.log("Error archiving notification: ", err);
			throw new Error("Failed to archive notification");
		}
	});
