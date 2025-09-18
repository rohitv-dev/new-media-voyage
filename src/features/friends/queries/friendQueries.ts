import { mutationOptions, queryOptions } from "@tanstack/react-query";
import {
	fetchFriends,
	sendFriendRequest,
	updateFriendRequest,
} from "../services/friendService";

export const sendFriendReqMutOptions = ({
	onSuccess,
}: {
	onSuccess: () => void;
}) =>
	mutationOptions({
		mutationFn: ({ friendData }: { friendData: string }) =>
			sendFriendRequest({ data: { friendData } }),
		onSuccess: () => {
			onSuccess?.();
		},
	});

export const fetchFriendsQueryOptions = () =>
	queryOptions({
		queryKey: ["friends"],
		queryFn: () => fetchFriends(),
	});

export const acceptFriendReqMutOptions = () =>
	mutationOptions({
		mutationFn: ({ id }: { id: number }) =>
			updateFriendRequest({ data: { id, status: "Friends" } }),
	});

export const rejectFriendReqMutOptions = () =>
	mutationOptions({
		mutationFn: ({ id }: { id: number }) =>
			updateFriendRequest({ data: { id, status: "Rejected" } }),
	});
