import { db } from "@/lib/db";
import { type AddMedia, mediaTable } from "@/lib/db/schemas/media";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { addMediaSchema } from "../schemas/mediaSchema";

export const fetchSingleMedia = createServerFn({ method: "GET" })
	.validator(({ uid, id }: { uid: string; id: number }) => ({ uid, id }))
	.handler(async (ctx) => {
		try {
			const media = await db
				.select()
				.from(mediaTable)
				.where(
					and(
						eq(mediaTable.userId, ctx.data.uid),
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
	.validator((uid: string) => uid)
	.handler(async (ctx) => {
		try {
			const media = await db
				.select()
				.from(mediaTable)
				.where(eq(mediaTable.userId, ctx.data));
			return media;
		} catch (err) {
			console.log("Error fetching media: ", err);
			throw new Error("Failed to fetch media");
		}
	});

export const addMedia = createServerFn({ method: "POST" })
	.validator(({ uid, media }: { uid: string; media: AddMedia }) => {
		const parsedMedia = addMediaSchema.parse(media);

		return { uid, media: parsedMedia };
	})
	.handler(async (ctx) => {
		try {
			const newMedia = await db
				.insert(mediaTable)
				.values({
					...ctx.data.media,
					userId: ctx.data.uid,
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
	.validator(
		({ uid, id, media }: { uid: string; id: number; media: AddMedia }) => {
			const parsedMedia = addMediaSchema.parse(media);

			return { uid, id, media: parsedMedia };
		},
	)
	.handler(async (ctx) => {
		try {
			const updatedMedia = await db
				.update(mediaTable)
				.set({
					...ctx.data.media,
					updatedAt: new Date(),
				})
				.where(
					and(
						eq(mediaTable.userId, ctx.data.uid),
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
