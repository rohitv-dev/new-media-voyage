import { useQuery } from "@tanstack/react-query";
import { BellIcon, CrossIcon, LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/Drawer";
import { unreadNotifCountQueryOptions } from "../queries/notificationQueries";
import { ReadNotifications } from "./ReadNotifications";
import { UnreadNotifications } from "./UnreadNotifications";

export function NotificationSection() {
	const [open, setOpen] = useState(false);

	const {
		data: unreadNotifCount,
		isLoading: isUnreadNotifCountLoading,
		isError: isUnreadNotifCountError,
		error: unreadNotifCountError,
	} = useQuery(unreadNotifCountQueryOptions());

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant="outline" className="relative">
					{unreadNotifCount && unreadNotifCount.count > 0 && (
						<div className="absolute size-3 right-0 top-0 bg-red-500 rounded-full" />
					)}
					{isUnreadNotifCountLoading && (
						<LoaderCircleIcon className="animate-spin absolute size-3 right-0 top-0" />
					)}
					{isUnreadNotifCountError && (
						<CrossIcon className="absolute size-3 right-0 top-0 text-primary" />
					)}
					<BellIcon />
				</Button>
			</DrawerTrigger>
			<DrawerContent className="h-[600px] min-w-[200px] p-2 px-2 md:px-8 overflow-y-auto overflow-hidden">
				<DrawerHeader>
					<DrawerTitle className="text-xl font-bold">Notifications</DrawerTitle>
				</DrawerHeader>
				<div className="flex justify-center items-center">
					{isUnreadNotifCountError && (
						<div className="font-bold text-destructive">
							{unreadNotifCountError.message}
						</div>
					)}
				</div>
				<UnreadNotifications open={open} />
				<ReadNotifications open={open} />
			</DrawerContent>
		</Drawer>
	);
}
