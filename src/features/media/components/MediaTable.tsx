import { useNavigate } from "@tanstack/react-router";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { DataTable } from "@/components/dataTable/DataTable";
import { Rating } from "@/components/ui/Rating";
import { MediaActionsDropdown } from "@/features/media/components/MediaActionsDropdown";
import { MediaCard } from "@/features/media/components/MediaCard";
import type { Media } from "@/lib/db/schemas/media";
import { formatDate } from "@/utils/functions/dateFunctions";

interface MediaTableProps {
	data: Media[];
	hideActions?: boolean;
}

export function MediaTable({ data, hideActions = false }: MediaTableProps) {
	const columnHelper = createColumnHelper<Media>();
	const navigate = useNavigate();

	// biome-ignore lint/suspicious/noExplicitAny: <any is fine here>
	const columns: ColumnDef<Media, any>[] = useMemo(
		() => [
			columnHelper.accessor("title", { header: "Title" }),
			columnHelper.accessor("type", { header: "Type" }),
			columnHelper.accessor("status", { header: "Status" }),
			columnHelper.accessor("genre", { header: "Genre" }),
			columnHelper.accessor("platform", { header: "Platform" }),
			columnHelper.accessor("createdAt", {
				header: "Added On",
				cell: (info) => formatDate(info.getValue()),
			}),
			columnHelper.accessor("rating", {
				header: "Rating",
				cell: (info) => <Rating readOnly rating={info.getValue()} />,
			}),
			columnHelper.display({
				id: "Actions",
				header: () => "",
				cell: ({ row: { original: media } }) => {
					if (hideActions) return null;

					return <MediaActionsDropdown media={media} />;
				},
			}),
		],
		[columnHelper, hideActions],
	);

	return (
		<>
			{/* Mobile/Tablet view - Media Cards in list view */}
			<div className="lg:hidden space-y-4">
				{data.map((media) => (
					<MediaCard listView key={media.id} data={media} />
				))}
			</div>

			{/* Desktop view - Data Table */}
			<div className="hidden lg:block">
				<DataTable
					columns={columns}
					data={data}
					onRowClick={(data) => {
						navigate({
							to: "/media/view/$id",
							params: {
								id: String(data.id),
							},
						});
					}}
				/>
			</div>
		</>
	);
}
