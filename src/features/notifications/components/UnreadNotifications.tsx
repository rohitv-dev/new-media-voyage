import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import { formatDateAndTime } from "@/utils/functions/dateFunctions";
import {
	fetchUnreadNotificationsQueryOptions,
	markNotifAsReadMutationOptions,
} from "../queries/notificationQueries";

interface UnreadNotificationsProps {
	open: boolean;
}

export function UnreadNotifications({ open }: UnreadNotificationsProps) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const markAsRead = useMutation(markNotifAsReadMutationOptions());

	const { data, isLoading } = useQuery(
		fetchUnreadNotificationsQueryOptions(open),
	);

	const markNotifAsRead = async (id: number) => {
		await markAsRead.mutateAsync(id, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["notif"] });
			},
		});
	};

	if (isLoading)
		return (
			<div className="flex gap-2 w-full justify-center">
				<LoaderIcon className="animate-spin" />
				<div className="font-medium">Loading New Notifications</div>
			</div>
		);

	return (
		<div>
			{data && data.length > 0 && (
				<div>
					<div className="font-bold text-secondary text-center">New</div>
					<div className="h-1 bg-secondary w-full border"></div>
				</div>
			)}
			{data?.map((n) => (
				<Card key={n.id} className="mt-4">
					<CardHeader>
						<div className="flex justify-between">
							<div>
								<CardTitle>{n.title}</CardTitle>
								<CardDescription className="mt-2">
									{n.description}
								</CardDescription>
							</div>
							<div className="flex flex-col items-end">
								<div className="text-xs md:text-sm">
									{formatDateAndTime(n.createdAt)}
								</div>
								<Button
									variant="link"
									className=""
									onClick={() => markNotifAsRead(n.id)}
								>
									Mark as read
								</Button>
							</div>
						</div>
					</CardHeader>
					<CardFooter>
						{n.type === "FriendRequest" && (
							<div>
								<Button onClick={() => navigate({ to: "/profile" })} size="xs">
									View
								</Button>
							</div>
						)}
					</CardFooter>
				</Card>
			))}
		</div>
	);
}
