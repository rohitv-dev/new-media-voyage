import { useSuspenseQuery } from "@tanstack/react-query";
import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { MediaCountBarChart } from "@/features/media/components/charts/MediaCountBarChart";
import { MediaProgressAreaChart } from "@/features/media/components/charts/MediaProgressAreaChart";
import { MediaTypeBarChart } from "@/features/media/components/charts/MediaTypeBarChart";
import { PlatformBarChart } from "@/features/media/components/charts/PlatformBarChart";
import { fetchMediaOverviewQueryOptions } from "@/features/media/queries/mediaQueries";

export const Route = createFileRoute("/_protected/dashboard")({
	ssr: false,
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(fetchMediaOverviewQueryOptions());
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { data } = useSuspenseQuery(fetchMediaOverviewQueryOptions());

	return (
		<ClientOnly fallback={<div>Loading...</div>}>
			<div className="flex flex-col md:grid md:grid-cols-2 gap-4 mt-4">
				<MediaCountBarChart data={data.statsByStatus} />
				<PlatformBarChart data={data.platformCounts} />
				<MediaProgressAreaChart
					addedData={data.mediaAddedProgressive}
					completedData={data.mediaCompletedProgressive}
				/>
				<MediaTypeBarChart data={data.typeCounts} />
			</div>
		</ClientOnly>
	);
}
