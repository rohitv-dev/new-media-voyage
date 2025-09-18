import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { FriendsList } from "@/features/friends/components/FriendsList";
import { PendingFriendRequests } from "@/features/friends/components/PendingFriendRequests";
import { fetchFriendsQueryOptions } from "@/features/friends/queries/friendQueries";
import { UserCard } from "@/features/users/components/UserCard";
import { authClient } from "@/lib/auth/auth-client";
import { authQueryOptions } from "@/lib/auth/queries";

export const Route = createFileRoute("/_protected/profile")({
	loader: async ({ context }) => {
		context.queryClient.ensureQueryData(fetchFriendsQueryOptions());
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { user } = Route.useRouteContext();
	const queryClient = useQueryClient();
	const navigate = Route.useNavigate();

	const { data: friends } = useSuspenseQuery(fetchFriendsQueryOptions());

	if (!user) return <div>Loading...</div>;

	const friendsList = friends.filter((f) => f.status === "Friends");
	const pendingRequests = friends.filter((f) => f.status === "Pending");

	return (
		<div className="max-w-sm mx-auto flex flex-col gap-4">
			<UserCard
				email={user.email}
				createdAt={user.createdAt}
				name={user.name}
			/>
			<FriendsList data={friendsList} />
			<PendingFriendRequests data={pendingRequests} />
			<Button
				size="sm"
				className="max-w-sm w-full"
				variant="destructive"
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
	);
}
