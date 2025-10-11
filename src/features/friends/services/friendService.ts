import { createServerFn } from "@tanstack/react-start";
import { and, eq, or } from "drizzle-orm";
import { archiveNotification } from "@/features/notifications/services/notificationService";
import { authMiddleware } from "@/lib/auth/middleware";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schemas/auth";
import { type FriendWithUser, friendTable } from "@/lib/db/schemas/friend";
import { notificationTable } from "@/lib/db/schemas/notification";

export const fetchFriends = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async (ctx) => {
		try {
			const { id } = ctx.context.user;

			const friends = await db
				.select({
					id: friendTable.id,
					senderId: friendTable.senderId,
					receipientId: friendTable.receipientId,
					user: {
						id: user.id,
						name: user.name,
						email: user.email,
					},
					status: friendTable.status,
				})
				.from(friendTable)
				.where(
					or(
						eq(friendTable.senderId, user.id),
						eq(friendTable.receipientId, user.id),
					),
				)
				.leftJoin(
					user,
					or(
						and(
							eq(friendTable.senderId, id),
							eq(friendTable.receipientId, user.id),
						),
						and(
							eq(friendTable.receipientId, id),
							eq(friendTable.senderId, user.id),
						),
					),
				);

			return friends as FriendWithUser[];
		} catch (err) {
			console.log("Error fetching friends: ", err);
			throw new Error("Failed to fetch friends");
		}
	});

export const sendFriendRequest = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(({ friendData }: { friendData: string }) => ({
		friendData,
	}))
	.handler(async (ctx) => {
		try {
			const { id, name } = ctx.context.user;

			const users = await db
				.select()
				.from(user)
				.where(
					or(
						eq(user.email, ctx.data.friendData),
						eq(user.username, ctx.data.friendData),
					),
				);

			if (users.length === 0) throw new Error("Could not find user");

			const friendId = users[0].id;

			if (friendId === id)
				throw new Error(
					"You need a minimum of two people to form a friendship -_- you daft dimbo",
				);

			const friends = await db
				.select()
				.from(friendTable)
				.where(
					or(
						and(
							eq(friendTable.senderId, id),
							eq(friendTable.receipientId, friendId),
						),
						and(
							eq(friendTable.senderId, friendId),
							eq(friendTable.receipientId, id),
						),
					),
				);

			if (friends.length > 0) {
				const status = friends[0].status;

				if (status === "Pending")
					throw new Error(
						"You have already sent a friend request to this user",
					);
				if (status === "Friends")
					throw new Error("You are already friends with this user");
				if (status === "Rejected") throw new Error("Well.....");

				throw new Error("Something went wrong");
			}

			await db.transaction(async (tx) => {
				await tx.insert(friendTable).values({
					senderId: id,
					receipientId: users[0].id,
					status: "Pending",
				});

				await tx.insert(notificationTable).values({
					title: "Friend Request",
					description: `You have a friend request from ${name}`,
					actorId: id,
					for: users[0].id,
					status: "Unread",
					type: "FriendRequest",
				});
			});
		} catch (err) {
			console.log("Error sending friend request: ", err);
			throw new Error(String(err));
		}
	});

export const updateFriendRequest = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator(
		({ id, status }: { id: number; status: "Friends" | "Rejected" }) => ({
			id,
			status,
		}),
	)
	.handler(async (ctx) => {
		try {
			const { id: userId } = ctx.context.user;
			const friends = await db
				.select()
				.from(friendTable)
				.where(
					and(
						eq(friendTable.id, ctx.data.id),
						eq(friendTable.status, "Pending"),
						eq(friendTable.receipientId, userId),
					),
				);

			if (friends.length === 0) throw new Error("Invalid Friend Request");

			await db.transaction(async (tx) => {
				await tx
					.update(friendTable)
					.set({
						status: ctx.data.status,
						updatedAt: new Date(),
					})
					.where(eq(friendTable.id, ctx.data.id));

				const notifs = await tx
					.select()
					.from(notificationTable)
					.where(
						and(
							eq(notificationTable.type, "FriendRequest"),
							eq(notificationTable.for, userId),
							eq(notificationTable.actorId, friends[0].senderId),
							eq(notificationTable.status, "Unread"),
						),
					);

				if (notifs.length > 0) {
					const notifId = notifs[0].id;
					await archiveNotification({
						data: { id: notifId, reason: "Friend Request Accepted/Rejected" },
					});
				}
			});
		} catch (err) {
			console.log("Error accepting friend request", err);
			throw new Error("Failed to accept friend request");
		}
	});
