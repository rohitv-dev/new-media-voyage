import { db } from "@/lib/db";
import { user } from "@/lib/db/schemas/auth";
import { type FriendWithUser, friendTable } from "@/lib/db/schemas/friend";
import { notificationTable } from "@/lib/db/schemas/notification";
import { createServerFn } from "@tanstack/react-start";
import { and, eq, or } from "drizzle-orm";

export const fetchFriends = createServerFn({ method: "GET" })
	.validator(({ uid }: { uid: string }) => uid)
	.handler(async (ctx) => {
		try {
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
							eq(friendTable.senderId, ctx.data),
							eq(friendTable.receipientId, user.id),
						),
						and(
							eq(friendTable.receipientId, ctx.data),
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
	.validator(({ uid, friendData }: { uid: string; friendData: string }) => ({
		uid,
		friendData,
	}))
	.handler(async (ctx) => {
		console.log(ctx.data);

		try {
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

			if (friendId === ctx.data.uid)
				throw new Error(
					"You need a minimum of two people to form a friendship -_-",
				);

			const friends = await db
				.select()
				.from(friendTable)
				.where(
					or(
						and(
							eq(friendTable.senderId, ctx.data.uid),
							eq(friendTable.receipientId, friendId),
						),
						and(
							eq(friendTable.senderId, friendId),
							eq(friendTable.receipientId, ctx.data.uid),
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

			db.transaction(async (tx) => {
				await tx.insert(friendTable).values({
					senderId: ctx.data.uid,
					receipientId: users[0].id,
				});

				await tx.insert(notificationTable).values({
					title: "Friend Request",
					description: `You have a friend request from ${users[0].name}`,
					actorId: ctx.data.uid,
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

export const acceptFriendRequest = createServerFn({ method: "POST" })
	.validator(({ id, uid }: { id: number; uid: string }) => ({ uid, id }))
	.handler(async (ctx) => {
		try {
			const friends = await db
				.select()
				.from(friendTable)
				.where(
					and(
						eq(friendTable.id, ctx.data.id),
						eq(friendTable.status, "Pending"),
						eq(friendTable.receipientId, ctx.data.uid),
					),
				);

			if (friends.length === 0) throw new Error("Invalid Friend Request");

			await db
				.update(friendTable)
				.set({
					status: "Friends",
					updatedAt: new Date(),
				})
				.where(eq(friendTable.id, ctx.data.id));
		} catch (err) {
			console.log("Error accepting friend request", err);
			throw new Error("Failed to accept friend request");
		}
	});

export const rejectFriendRequest = createServerFn({ method: "POST" })
	.validator(({ id, uid }: { id: number; uid: string }) => ({ uid, id }))
	.handler(async (ctx) => {
		try {
			const friends = await db
				.select()
				.from(friendTable)
				.where(
					and(
						eq(friendTable.id, ctx.data.id),
						eq(friendTable.status, "Pending"),
						eq(friendTable.receipientId, ctx.data.uid),
					),
				);

			if (friends.length === 0) throw new Error("Invalid Friend Request");

			await db
				.update(friendTable)
				.set({
					status: "Rejected",
					updatedAt: new Date(),
				})
				.where(eq(friendTable.id, ctx.data.id));
		} catch (err) {
			console.log("Error accepting friend request", err);
			throw new Error("Failed to accept friend request");
		}
	});
