import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, LoaderCircleIcon, User2Icon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { FriendWithUser } from "@/lib/db/schemas/friend";
import {
	acceptFriendReqMutOptions,
	rejectFriendReqMutOptions,
} from "../queries/friendQueries";

interface PendingFriendRequestsProps {
	data: FriendWithUser[];
}

export function PendingFriendRequests({ data }: PendingFriendRequestsProps) {
	const queryClient = useQueryClient();

	const acceptMutation = useMutation(acceptFriendReqMutOptions());
	const rejectMutation = useMutation(rejectFriendReqMutOptions());

	if (data.length === 0) return null;

	const acceptRequest = async (id: number) => {
		await acceptMutation.mutateAsync({ id });
		await queryClient.invalidateQueries({
			queryKey: ["notif"],
		});
	};

	const rejectRequest = async (id: number) => {
		await rejectMutation.mutateAsync({ id });
		await queryClient.invalidateQueries({
			queryKey: ["notif"],
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Pending Friend Requests</CardTitle>
			</CardHeader>
			<CardContent>
				{data.map((request) => {
					if (!request.user) return null;
					return (
						<div key={request.id} className="mb-2">
							<div className="flex items-center gap-2">
								<User2Icon size={16} />
								<div>{request.user.name}</div>
								<div className="gap-1 ml-4">
									<Button
										disabled={
											acceptMutation.isPending || rejectMutation.isPending
										}
										className="text-green-500 cursor-pointer"
										size="xs"
										variant="ghost"
										onClick={() => acceptRequest(request.id)}
									>
										{acceptMutation.isPending ? (
											<LoaderCircleIcon className="animate-spin" />
										) : (
											<CheckIcon />
										)}
									</Button>
									<Button
										disabled={
											rejectMutation.isPending || acceptMutation.isPending
										}
										className="text-red-500 cursor-pointer"
										size="xs"
										variant="ghost"
										onClick={() => rejectRequest(request.id)}
									>
										{rejectMutation.isPending ? (
											<LoaderCircleIcon className="animate-spin" />
										) : (
											<XIcon />
										)}
									</Button>
								</div>
							</div>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
