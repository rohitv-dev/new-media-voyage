import { fetchMedia } from "@/services/mediaService";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/media/")({
	loader: () => fetchMedia(),
	component: RouteComponent,
});

function RouteComponent() {
	const media = Route.useLoaderData();

	console.log(media);

	return <div>Hello "/media/"!</div>;
}
