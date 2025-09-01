import { MediaTable } from "@/features/media/components/MediaTable";
import { fetchFriendMediaQueryOptions } from "@/features/media/queries/mediaQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/media/$friendName/media")({
	loader: ({ context, params }) => {
		context.queryClient.ensureQueryData(
			fetchFriendMediaQueryOptions({
				friendName: params.friendName,
				uid: context.user!.id,
			}),
		);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { friendName } = Route.useParams();
	const { user } = Route.useRouteContext();

	const { data } = useSuspenseQuery(
		fetchFriendMediaQueryOptions({ friendName, uid: user!.id }),
	);

	return (
		<div>
			<h3 className="text-lg font-bold mb-4">Viewing {friendName}'s Media</h3>
			<MediaTable hideActions data={data} />
		</div>
	);
}
