import { Button } from "@/components/ui/Button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { FriendRequestForm } from "@/features/friends/forms/FriendRequestForm";
import {
	acceptFriendReqMutOptions,
	fetchFriendsQueryOptions,
	rejectFriendReqMutOptions,
} from "@/features/friends/queries/friendQueries";
import { authClient } from "@/lib/auth/auth-client";
import { authQueryOptions } from "@/lib/auth/queries";
import { formatDate } from "@/utils/functions/dateFunctions";
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CheckIcon, PlusIcon, User2Icon, UserIcon, XIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_protected/profile")({
	loader: async ({ context }) => {
		context.queryClient.ensureQueryData(fetchFriendsQueryOptions());
	},
	component: RouteComponent,
});

function RouteComponent() {
	const [open, setOpen] = useState(false);
	const { user } = Route.useRouteContext();
	const queryClient = useQueryClient();
	const navigate = Route.useNavigate();

	const { data: friends } = useSuspenseQuery(fetchFriendsQueryOptions());

	const acceptMutation = useMutation(acceptFriendReqMutOptions());
	const rejectMutation = useMutation(rejectFriendReqMutOptions());

	const acceptRequest = (id: number) => {
		acceptMutation.mutateAsync({ id }).then(() => {
			queryClient.invalidateQueries({
				queryKey: fetchFriendsQueryOptions().queryKey,
			});
		});
	};

	const rejectRequest = (id: number) => {
		rejectMutation.mutateAsync({ id }).then(() => {
			queryClient.invalidateQueries({
				queryKey: fetchFriendsQueryOptions().queryKey,
			});
		});
	};

	if (!user) return <div>Loading...</div>;

	const friendsList = friends.filter((f) => f.status === "Friends");
	const pendingRequests = friends.filter((f) => f.status === "Pending");

	return (
		<div>
			<Card className="max-w-sm mx-auto text-center">
				<CardHeader>
					<CardTitle>
						<div>
							<UserIcon className="mx-auto" size={40} />
							<div className="mt-2 font-bold text-xl">{user.name}</div>
						</div>
					</CardTitle>
					<CardDescription>
						<div>{user.email}</div>
						<div>Member since {formatDate(user.createdAt)}</div>
					</CardDescription>
				</CardHeader>
			</Card>
			{friendsList.length > 0 && (
				<Card className="max-w-sm mx-auto mt-4">
					<CardHeader className="flex justify-between items-center">
						<CardTitle>Friends</CardTitle>
						<Dialog open={open} onOpenChange={setOpen}>
							<DialogTrigger asChild>
								<Button variant="ghost">
									<PlusIcon />
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Send Friend Request</DialogTitle>
								</DialogHeader>
								<FriendRequestForm />
							</DialogContent>
						</Dialog>
					</CardHeader>
					<CardContent>
						{friendsList.map((friend) => {
							if (!friend.user) return null;

							return (
								<div key={friend.id}>
									<div className="flex items-center gap-2">
										<User2Icon size={16} />
										<div>{friend.user.name}</div>
										<Button
											className="ml-4"
											size="xs"
											onClick={() => {
												if (friend.user)
													navigate({
														to: "/media/$friendName/media",
														params: {
															friendName: friend.user.name,
														},
													});
											}}
										>
											View Media
										</Button>
									</div>
								</div>
							);
						})}
					</CardContent>
				</Card>
			)}
			{pendingRequests.length > 0 && (
				<Card className="max-w-sm mx-auto mt-4">
					<CardHeader>
						<CardTitle>Pending Friend Requests</CardTitle>
					</CardHeader>
					<CardContent>
						{pendingRequests.map((request) => {
							if (!request.user) return null;
							return (
								<div key={request.id} className="mb-2">
									<div className="flex items-center gap-2">
										<User2Icon size={16} />
										<div>{request.user.name}</div>
										<div className="gap-1 ml-4">
											<Button
												className="text-green-500 cursor-pointer"
												size="xs"
												variant="ghost"
												onClick={() => acceptRequest(request.id)}
											>
												<CheckIcon />
											</Button>
											<Button
												className="text-red-500 cursor-pointer"
												size="xs"
												variant="ghost"
												onClick={() => rejectRequest(request.id)}
											>
												<XIcon />
											</Button>
										</div>
									</div>
								</div>
							);
						})}
					</CardContent>
				</Card>
			)}
			<div className="flex w-full justify-center mt-8">
				<Button
					size="sm"
					className=""
					onClick={() => {
						authClient.signOut().then(() => {
							queryClient.removeQueries({
								queryKey: authQueryOptions().queryKey,
							});
							navigate({ to: "/login" });
						});
					}}
				>
					Logout
				</Button>
			</div>
		</div>
	);
}
