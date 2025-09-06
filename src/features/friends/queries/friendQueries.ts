import { mutationOptions, queryOptions } from "@tanstack/react-query";
import {
	acceptFriendRequest,
	fetchFriends,
	rejectFriendRequest,
	sendFriendRequest,
} from "../services/friendService";

export const sendFriendReqMutOptions = () =>
	mutationOptions({
		mutationFn: ({ friendData }: { friendData: string }) =>
			sendFriendRequest({ data: { friendData } }),
	});

export const fetchFriendsQueryOptions = () =>
	queryOptions({
		queryKey: ["friends"],
		queryFn: () => fetchFriends(),
	});

export const acceptFriendReqMutOptions = () =>
	mutationOptions({
		mutationFn: ({ id }: { id: number }) =>
			acceptFriendRequest({ data: { id } }),
	});

export const rejectFriendReqMutOptions = () =>
	mutationOptions({
		mutationFn: ({ id }: { id: number }) =>
			rejectFriendRequest({ data: { id } }),
	});
