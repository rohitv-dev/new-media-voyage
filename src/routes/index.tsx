import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	beforeLoad: async ({ context }) => {
		if (!context.user) {
			throw redirect({ to: "/login" });
		}
		throw redirect({ to: "/dashboard" });
	},
	component: App,
});

function App() {
	return <Outlet />;
}
