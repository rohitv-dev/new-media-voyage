import { MediaCard } from "@/features/media/components/MediaCard";
import { fetchSingleMediaQueryOptions } from "@/features/media/queries/mediaQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/media/view/$id")({
	loader: ({ context, params }) => {
		context.queryClient.ensureQueryData(
			fetchSingleMediaQueryOptions(Number(params.id)),
		);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();

	const { data } = useSuspenseQuery(
		fetchSingleMediaQueryOptions(Number(id)),
	);

	return <MediaCard data={data} />;
}
