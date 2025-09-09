import { FilterComponent } from "@/components/FilterComponent";
import { Button } from "@/components/ui/Button";
import { ExportMediaButton } from "@/features/media/components/ExportMediaButton";
import { MediaTable } from "@/features/media/components/MediaTable";
import { fetchFilteredMediaQueryOptions } from "@/features/media/queries/mediaQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { PlusIcon } from "lucide-react";
import z from "zod";

export const Route = createFileRoute("/media/")({
	validateSearch: zodValidator(
		z.object({
			status: fallback(z.string(), "").default(""),
			type: fallback(z.string(), "").default(""),
			title: fallback(z.string(), "").default(""),
			platform: fallback(z.string(), "").default(""),
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
	const navigate = Route.useNavigate();

	const { data } = useSuspenseQuery(fetchFilteredMediaQueryOptions(search));
	return (
		<div className="pb-10">
			<div className="flex justify-end mb-4 gap-2">
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
				<ExportMediaButton />
			</div>
			<MediaTable data={data ?? []} />
			<Button
				className="fixed bottom-4 right-8 rounded-full size-12"
				onClick={() => navigate({ to: "/media/add" })}
			>
				<PlusIcon />
			</Button>
		</div>
	);
}
