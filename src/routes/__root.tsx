import {
	HeadContent,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import appCss from "../styles.css?url";

import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { authQueryOptions } from "@/lib/auth/queries";
import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async ({ context }) => {
		const user = await context.queryClient.ensureQueryData(authQueryOptions());
		return { user };
	},
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body>
				<ThemeProvider>
					<Navbar />
					<div className="container mx-auto px-2 md:px-4 mt-4 md:mt-8">
						{children}
					</div>
					<TanStackRouterDevtools initialIsOpen={false} />
					<ReactQueryDevtools initialIsOpen={false} />
				</ThemeProvider>
				<Scripts />
			</body>
		</html>
	);
}
