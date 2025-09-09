import z from "zod/v4";

export const addMediaSchema = z
	.object({
		title: z.string().min(1, "Title is required"),
		startDate: z.date().optional(),
		completedDate: z.date().optional(),
		comments: z.string().optional(),
		rating: z.number(),
		type: z.string(),
		status: z.string(),
		platform: z.string().optional(),
		recommended: z.boolean().optional(),
		isPrivate: z.boolean(),
		genre: z.string().optional(),
	})
	.refine(
		(val) => {
			if (val.status === "Completed" && !val.completedDate) return false;
			return true;
		},
		{
			path: ["completedDate"],
			error: "Completed Date is required when Status is Completed",
		},
	);
