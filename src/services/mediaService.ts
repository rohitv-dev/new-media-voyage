import { db } from "@/lib/db";
import { mediaTable } from "@/lib/db/schemas/media";
import { createServerFn } from "@tanstack/react-start";

export const fetchMedia = createServerFn({ method: "GET" }).handler(
	async () => {
		try {
			const media = await db.select().from(mediaTable);
			return media;
		} catch (err) {
			console.log("Error fetching media: ", err);
			throw new Error("Failed to fetch media");
		}
	},
);
