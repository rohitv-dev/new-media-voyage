import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";
import { PlusIcon, User2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { DialogHeader } from "@/components/ui/dialog";
import type { FriendWithUser } from "@/lib/db/schemas/friend";
import { FriendRequestForm } from "../forms/FriendRequestForm";

interface FriendsListProps {
	data: FriendWithUser[];
}

export function FriendsList({ data }: FriendsListProps) {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);

	return (
		<Card>
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
						<FriendRequestForm onSuccess={() => setOpen(false)} />
					</DialogContent>
				</Dialog>
			</CardHeader>
			<CardContent>
				{data.map((friend) => {
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
	);
}
