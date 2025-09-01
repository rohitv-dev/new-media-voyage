import type { AddMedia } from "@/lib/db/schemas/media";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import {
	addMedia,
	fetchFriendMedia,
	fetchMedia,
	fetchSingleMedia,
	updateMedia,
} from "../services/mediaService";

export const fetchSingleMediaQueryOptions = (uid: string, id: number) =>
	queryOptions({
		queryKey: ["media", id],
		queryFn: () => fetchSingleMedia({ data: { uid, id } }),
	});

export const fetchMediaQueryOptions = (uid: string) =>
	queryOptions({
		queryKey: ["media"],
		queryFn: () => fetchMedia({ data: uid }),
	});

export const fetchFriendMediaQueryOptions = ({
	uid,
	friendName,
}: { uid: string; friendName: string }) =>
	queryOptions({
		queryKey: ["media", "friend", friendName],
		queryFn: () => fetchFriendMedia({ data: { friendName, uid } }),
	});

export const addMediaMutationOptions = () =>
	mutationOptions({
		mutationFn: async ({ uid, media }: { uid: string; media: AddMedia }) =>
			addMedia({ data: { uid, media } }),
	});

export const updateMediaMutationOptions = () =>
	mutationOptions({
		mutationFn: async ({
			uid,
			id,
			media,
		}: { uid: string; id: number; media: AddMedia }) =>
			updateMedia({ data: { uid, id, media } }),
	});
