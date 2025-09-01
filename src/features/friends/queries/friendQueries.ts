import { mutationOptions, queryOptions } from "@tanstack/react-query";
import {
	acceptFriendRequest,
	fetchFriends,
	rejectFriendRequest,
	sendFriendRequest,
} from "../services/friendService";

export const sendFriendReqMutOptions = () =>
	mutationOptions({
		mutationFn: ({ uid, friendData }: { uid: string; friendData: string }) =>
			sendFriendRequest({ data: { uid, friendData } }),
	});

export const fetchFriendsQueryOptions = (uid: string) =>
	queryOptions({
		queryKey: ["friends"],
		queryFn: () => fetchFriends({ data: { uid } }),
	});

export const acceptFriendReqMutOptions = () =>
	mutationOptions({
		mutationFn: ({ id, uid }: { id: number; uid: string }) =>
			acceptFriendRequest({ data: { id, uid } }),
	});

export const rejectFriendReqMutOptions = () =>
	mutationOptions({
		mutationFn: ({ id, uid }: { id: number; uid: string }) =>
			rejectFriendRequest({ data: { id, uid } }),
	});
