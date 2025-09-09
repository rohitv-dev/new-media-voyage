import { AddMediaForm } from "@/features/media/forms/AddMediaForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/media/add")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	return <AddMediaForm />;
}
