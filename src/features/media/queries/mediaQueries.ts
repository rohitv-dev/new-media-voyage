import type { AddMedia } from "@/lib/db/schemas/media";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import {
	addMedia,
	fetchFilteredMedia,
	fetchFriendMedia,
	fetchMediaById,
	fetchMediaOverview,
	updateMedia,
} from "../services/mediaService";

export const fetchMediaOverviewQueryOptions = () =>
	queryOptions({
		queryKey: ["media", "stats"],
		queryFn: () => fetchMediaOverview(),
		staleTime: Number.POSITIVE_INFINITY,
	});

export const fetchMediaByIdQueryOptions = (id: number) =>
	queryOptions({
		queryKey: ["media", id],
		queryFn: () => fetchMediaById({ data: { id } }),
	});

export const fetchFilteredMediaQueryOptions = ({
	status,
	type,
	title,
}: {
	status?: string;
	type?: string;
	title?: string;
}) =>
	queryOptions({
		queryKey: ["media", { status, type, title }],
		queryFn: () => fetchFilteredMedia({ data: { status, title, type } }),
		staleTime: Number.POSITIVE_INFINITY,
	});

export const fetchFriendMediaQueryOptions = ({
	friendName,
}: { friendName: string }) =>
	queryOptions({
		queryKey: ["media", "friend", friendName],
		queryFn: () => fetchFriendMedia({ data: { friendName } }),
	});

export const addMediaMutationOptions = () =>
	mutationOptions({
		mutationFn: async ({ media }: { media: AddMedia }) =>
			addMedia({ data: { media } }),
	});

export const updateMediaMutationOptions = () =>
	mutationOptions({
		mutationFn: async ({ id, media }: { id: number; media: AddMedia }) =>
			updateMedia({ data: { id, media } }),
	});
