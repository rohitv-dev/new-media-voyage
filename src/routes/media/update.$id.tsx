import { UpdateMediaForm } from "@/features/media/forms/UpdateMediaForm";
import { fetchMediaByIdQueryOptions } from "@/features/media/queries/mediaQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/media/update/$id")({
	ssr: false,
	loader: ({ context, params }) => {
		context.queryClient.ensureQueryData(
			fetchMediaByIdQueryOptions(Number(params.id)),
		);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();

	const { data } = useSuspenseQuery(fetchMediaByIdQueryOptions(Number(id)));

	return <UpdateMediaForm data={data} />;
}
