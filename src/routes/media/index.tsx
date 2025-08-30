import { MediaTable } from "@/features/media/components/MediaTable";
import { fetchMediaQueryOptions } from "@/features/media/queries/mediaQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/media/")({
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(
			fetchMediaQueryOptions(context.user!.id),
		);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { user } = Route.useRouteContext();

	const { data } = useSuspenseQuery(fetchMediaQueryOptions(user!.id));

	return (
		<div>
			<MediaTable data={data ?? []} />
		</div>
	);
}
