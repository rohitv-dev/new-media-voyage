import { useQuery } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import { formatDateAndTime } from "@/utils/functions/dateFunctions";
import { fetchReadNotificationsQueryOptions } from "../queries/notificationQueries";

interface ReadNotificationsProps {
	open: boolean;
}

export function ReadNotifications({ open }: ReadNotificationsProps) {
	const { data, isLoading } = useQuery(
		fetchReadNotificationsQueryOptions(open),
	);

	if (isLoading)
		return (
			<div className="flex gap-2 w-full justify-center">
				<LoaderCircleIcon className="animate-spin" />
				<div className="font-medium">Loading Read Notifications</div>
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
							</div>
						</div>
					</CardHeader>
				</Card>
			))}
		</div>
	);
}
