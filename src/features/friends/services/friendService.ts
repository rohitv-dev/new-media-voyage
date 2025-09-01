import { db } from "@/lib/db";
import { user } from "@/lib/db/schemas/auth";
import { type FriendWithUser, friendTable } from "@/lib/db/schemas/friend";
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
