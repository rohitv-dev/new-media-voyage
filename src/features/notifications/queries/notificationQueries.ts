import { queryOptions } from "@tanstack/react-query";
import {
	fetchReadNotifications,
	fetchUnreadNotifCount,
	fetchUnreadNotifications,
	markNotifAsRead,
	archiveNotification,
} from "../services/notificationService";

export const unreadNotifCountQueryOptions = () =>
	queryOptions({
		queryKey: ["notif", "unread", "count"],
		queryFn: () => fetchUnreadNotifCount(),
	});

export const fetchUnreadNotificationsQueryOptions = (enabled: boolean) =>
	queryOptions({
		queryKey: ["notif", "unread", "list"],
		queryFn: () => fetchUnreadNotifications(),
		enabled,
	});

export const fetchReadNotificationsQueryOptions = (enabled: boolean) =>
	queryOptions({
		queryKey: ["notif", "read", "list"],
		queryFn: () => fetchReadNotifications(),
		staleTime: Number.POSITIVE_INFINITY,
		enabled,
	});

export const markNotifAsReadMutationOptions = () => ({
	mutationFn: (id: number) => markNotifAsRead({ data: id }),
});

export const archiveNotificationMutationOptions = () => ({
	mutationFn: (input: { id: number; reason: string }) => archiveNotification({ data: input }),
});
