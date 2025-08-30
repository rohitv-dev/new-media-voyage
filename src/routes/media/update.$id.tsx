import { UpdateMediaForm } from "@/features/media/forms/UpdateMediaForm";
import { fetchSingleMediaQueryOptions } from "@/features/media/queries/mediaQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/media/update/$id")({
	ssr: false,
	loader: ({ context, params }) => {
		context.queryClient.ensureQueryData(
			fetchSingleMediaQueryOptions(context.user!.id, Number(params.id)),
		);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { user } = Route.useRouteContext();
	const { id } = Route.useParams();

	const { data } = useSuspenseQuery(
		fetchSingleMediaQueryOptions(user!.id, Number(id)),
	);

	return <UpdateMediaForm data={data} />;
}
