import { Navbar } from "@/components/Navbar";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
	beforeLoad: ({ context }) => {
		if (!context.user) throw redirect({ to: "/login" });
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<Navbar />
			<div className="mt-4" />
			<div className="px-2">
				<Outlet />
			</div>
		</div>
	);
}
