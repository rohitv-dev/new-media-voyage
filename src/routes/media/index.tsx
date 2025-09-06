import { FilterComponent } from "@/components/FilterComponent";
import { MediaTable } from "@/features/media/components/MediaTable";
import { fetchFilteredMediaQueryOptions } from "@/features/media/queries/mediaQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import z from "zod";

export const Route = createFileRoute("/media/")({
	validateSearch: zodValidator(
		z.object({
			status: fallback(z.string(), "").default(""),
			type: fallback(z.string(), "").default(""),
			title: fallback(z.string(), "").default(""),
		}),
	),
	loaderDeps: ({ search }) => search,
	loader: ({ context, deps }) => {
		context.queryClient.ensureQueryData(
			fetchFilteredMediaQueryOptions({
				status: deps.status,
				title: deps.title,
				type: deps.type,
			}),
		);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const search = Route.useSearch();

	const { data } = useSuspenseQuery(fetchFilteredMediaQueryOptions(search));

	return (
		<div>
			<div className="flex justify-end mb-4">
				<FilterComponent
					statusOptions={[
						{ label: "Completed", value: "Completed" },
						{
							label: "In Progress",
							value: "In Progress",
						},
						{ label: "Planned", value: "Planned" },
						{ label: "Dropped", value: "Dropped" },
					]}
					typeOptions={[
						{ label: "Movie", value: "Movie" },
						{ label: "Show", value: "Show" },
						{ label: "Game", value: "Game" },
						{ label: "Book", value: "Book" },
					]}
				/>
			</div>
			<MediaTable data={data ?? []} />
		</div>
	);
}
