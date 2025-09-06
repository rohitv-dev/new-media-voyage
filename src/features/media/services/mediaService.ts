import { authMiddleware } from "@/lib/auth/middleware";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schemas/auth";
import { friendTable } from "@/lib/db/schemas/friend";
import { type AddMedia, mediaTable } from "@/lib/db/schemas/media";
import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { addMediaSchema } from "../schemas/mediaSchema";

export const fetchSingleMedia = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.validator(({ id }: { id: number }) => ({ id }))
	.handler(async (ctx) => {
		try {
			const { id } = ctx.context.user;

			const media = await db
				.select()
				.from(mediaTable)
				.where(
					and(
						eq(mediaTable.userId, id),
						eq(mediaTable.id, Number(ctx.data.id)),
					),
				);

			if (media.length === 0) throw new Error("Media not found");

			return media[0];
		} catch (err) {
			console.log("Error fetching single media: ", err);
			throw new Error("Failed to fetch single media");
		}
	});

export const fetchMedia = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async (ctx) => {
		try {
			const { id } = ctx.context.user;

			const media = await db
				.select()
				.from(mediaTable)
				.where(eq(mediaTable.userId, id))
				.orderBy(desc(mediaTable.updatedAt));
			return media;
		} catch (err) {
			console.log("Error fetching media: ", err);
			throw new Error("Failed to fetch media");
		}
	});

export const fetchFilteredMedia = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((obj: { status?: string; type?: string; title?: string }) => obj)
	.handler(async (ctx) => {
		try {
			const { id } = ctx.context.user;

			const { status, title, type } = ctx.data;

			const media = await db
				.select()
				.from(mediaTable)
				.where(
					and(
						eq(mediaTable.userId, id),
						title ? ilike(mediaTable.title, `%${title}%`) : undefined,
						status ? eq(mediaTable.status, status) : undefined,
						type ? eq(mediaTable.type, type) : undefined,
					),
				);

			return media;
		} catch (err) {
			console.log("Error fetching filtered media: ", err);
			throw new Error("Failed to fetch filtered media");
		}
	});

export const fetchFriendMedia = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.validator(({ friendName }: { friendName: string }) => ({
		friendName,
	}))
	.handler(async (ctx) => {
		try {
			const { id } = ctx.context.user;

			const users = await db
				.select()
				.from(user)
				.where(eq(user.name, ctx.data.friendName));

			if (users.length === 0) throw new Error("Cannot find friend");

			const friendId = users[0].id;

			const friends = await db
				.select()
				.from(friendTable)
				.where(
					and(
						eq(friendTable.status, "Friends"),
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
					),
				);

			if (friends.length === 0) throw new Error("Not friends with this user");

			const media = await db
				.select()
				.from(mediaTable)
				.where(
					and(eq(mediaTable.userId, friendId), eq(mediaTable.isPrivate, false)),
				);

			return media;
		} catch (err) {
			console.log("Error fetching friend's media: ", err);
			throw new Error("Failed to fetch friend's media");
		}
	});

export const addMedia = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(({ media }: { media: AddMedia }) => {
		const parsedMedia = addMediaSchema.parse(media);

		return { media: parsedMedia };
	})
	.handler(async (ctx) => {
		try {
			const { id } = ctx.context.user;

			const newMedia = await db
				.insert(mediaTable)
				.values({
					...ctx.data.media,
					userId: id,
					createdAt: new Date(),
					updatedAt: new Date(),
				})
				.returning();

			return newMedia;
		} catch (err) {
			console.log("Error adding media: ", err);
			throw new Error("Failed to add media");
		}
	});

export const updateMedia = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(
		({ id, media }: { id: number; media: AddMedia }) => {
			const parsedMedia = addMediaSchema.parse(media);

			return { id, media: parsedMedia };
		},
	)
	.handler(async (ctx) => {
		try {
			const { id } = ctx.context.user;

			const updatedMedia = await db
				.update(mediaTable)
				.set({
					...ctx.data.media,
					updatedAt: new Date(),
				})
				.where(
					and(
						eq(mediaTable.userId, id),
						eq(mediaTable.id, ctx.data.id),
					),
				)
				.returning();

			return updatedMedia;
		} catch (err) {
			console.log("Error updating media: ", err);
			throw new Error("Failed to update media");
		}
	});
