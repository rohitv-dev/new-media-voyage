import { DataColumn } from "@/components/DataColumn";
import { Button } from "@/components/ui/Button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/badge";
import type { Media } from "@/lib/db/schemas/media";
import { formatDate } from "@/utils/functions/dateFunctions";
import { useNavigate } from "@tanstack/react-router";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	BookOpenIcon,
	BookmarkIcon,
	CalendarIcon,
	CheckCircleIcon,
	EyeClosedIcon,
	EyeIcon,
	GamepadIcon,
	LaptopIcon,
	MonitorIcon,
	StarIcon,
	TvIcon,
	XIcon,
} from "lucide-react";

interface MediaCardProps {
	data: Media;
	listView?: boolean;
}

function getMediaIcon(type: string) {
	switch (type) {
		case "Movie":
			return <MonitorIcon className="h-5 w-5" />;
		case "Show":
			return <TvIcon className="h-5 w-5" />;
		case "Book":
			return <BookOpenIcon className="h-5 w-5" />;
		case "Game":
			return <GamepadIcon className="h-5 w-5" />;
		default:
			return <LaptopIcon className="h-5 w-5" />;
	}
}

const StatusIcon = ({ status }: { status: string }) => {
	if (status === "Completed")
		return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
	if (status === "In Progress")
		return (
			<div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
				<div className="h-1.5 w-1.5 rounded-full bg-primary" />
			</div>
		);
	if (status === "Dropped") return <XIcon className="h-4 w-4 text-red-400" />;
	if (status === "Planned")
		return <BookmarkIcon className="h-4 w-4 text-amber-400" />;
};

export function MediaCard({ data, listView = false }: MediaCardProps) {
	const navigate = useNavigate();

	const editor = useEditor({
		immediatelyRender: false,
		editable: false,
		editorProps: {
			attributes: {
				class: "prose focus:outline-none dark:prose-invert",
			},
		},
		extensions: [StarterKit, TextAlign],
		content: data.comments,
	});

	if (!editor) return null;

	if (listView) {
		return (
			<Card className="py-4">
				<CardHeader>
					<CardTitle>
						<div className="text-base font-bold">{data.title}</div>
					</CardTitle>
					<CardDescription>
						<div>
							<div className="flex gap-2 items-center">
								<Badge className="rounded-xl text-[10px]">{data.type}</Badge>
								<Rating readOnly size={14} rating={data.rating ?? 0} />
								{data.rating ?? 0}/{5}
							</div>
							<div className="flex justify-between items-center mt-3">
								<div className="flex items-center gap-2">
									<StatusIcon status={data.status} />
									{data.status}
								</div>
								<div className="text-xs text-muted-foreground flex items-center gap-1">
									<CalendarIcon className="h-3 w-3" />
									Updated {formatDate(new Date(data.updatedAt))}
								</div>
							</div>
						</div>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex gap-2">
						<Button
							size="xs"
							onClick={() =>
								navigate({
									to: "/media/view/$id",
									params: { id: String(data.id) },
								})
							}
						>
							View
						</Button>
						<Button
							size="xs"
							variant="outline"
							onClick={() =>
								navigate({
									to: "/media/update/$id",
									params: { id: String(data.id) },
								})
							}
						>
							Update
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="shadow-lg border-0 rounded-2xl overflow-hidden max-w-4xl mx-auto w-full">
			<CardHeader className="p-6 py-2 md:px-8 md:py-4">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div className="flex items-start gap-4">
						<div className="bg-primary/10 p-3 rounded-xl">
							{getMediaIcon(data.type)}
						</div>
						<div>
							<h1 className="text-2xl md:text-3xl font-bold text-foreground">
								{data.title}
							</h1>
							<div className="flex items-center gap-2 mt-2">
								<span className="px-2 py-1 bg-primary text-white font-bold text-xs rounded-full">
									{data.type}
								</span>
								<div className="flex items-center gap-1">
									<div className="flex items-center">
										<Rating readOnly rating={data.rating ?? 0} size={18} />
									</div>
									<span className="text-sm text-white ml-1">
										{data.rating ?? 0}/5
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<DataColumn
						title="Status"
						value={data.status}
						icon={<StatusIcon status={data.status} />}
					/>
					<DataColumn
						title="Private"
						value={data.isPrivate ? "Yes" : "No"}
						icon={
							data.isPrivate ? (
								<EyeClosedIcon className="h-5 w-5" />
							) : (
								<EyeIcon className="h-5 w-5" />
							)
						}
					/>
					{data.platform && (
						<DataColumn
							title="Platform"
							value={data.platform}
							icon={<LaptopIcon className="h-5 w-5" />}
						/>
					)}
					{data.recommended && (
						<DataColumn
							title="Recommended"
							value={data.recommended ? "Yes" : "No"}
							icon={<StarIcon className="h-5 w-5" />}
						/>
					)}
					{data.completedDate && (
						<DataColumn
							title="Completed Date"
							value={formatDate(data.completedDate)}
							icon={<CalendarIcon className="h-5 w-5" />}
						/>
					)}
					<DataColumn
						title="Added On"
						value={formatDate(data.createdAt)}
						icon={<CalendarIcon className="h-5 w-5" />}
					/>
					<DataColumn
						title="Updated On"
						value={formatDate(data.updatedAt)}
						icon={<CalendarIcon className="h-5 w-5" />}
					/>
				</div>

				<div className="mt-2">
					<DataColumn
						title="Comments"
						icon={<BookOpenIcon className="h-5 w-5" />}
					>
						<EditorContent editor={editor} />
					</DataColumn>
				</div>
			</CardContent>
		</Card>
	);
}
