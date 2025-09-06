import { useAppForm } from "@/hooks/form";
import type { AddMedia, Media } from "@/lib/db/schemas/media";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
	fetchMediaQueryOptions,
	updateMediaMutationOptions,
} from "../queries/mediaQueries";
import { addMediaSchema } from "../schemas/mediaSchema";

interface UpdateMediaFormProps {
	data: Media;
}

export function UpdateMediaForm({ data }: UpdateMediaFormProps) {
	const { id } = useParams({ from: "/media/update/$id" });
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const mutation = useMutation(updateMediaMutationOptions());

	const form = useAppForm({
		defaultValues: {
			title: data.title,
			status: data.status,
			type: data.type,
			isPrivate: data.isPrivate,
			rating: data.rating,
			startDate: data.startDate || undefined,
			completedDate: data.completedDate || undefined,
			comments: data.comments || undefined,
			platform: data.platform || undefined,
			genre: data.genre || undefined,
			recommended: data.recommended || undefined,
			userId: data.userId,
		} as AddMedia,
		validators: {
			onSubmit: addMediaSchema,
		},
		onSubmit: ({ value }) => {
			mutation
				.mutateAsync({
					id: Number(id),
					media: value,
				})
				.then(() => {
					queryClient.invalidateQueries({
						queryKey: fetchMediaQueryOptions().queryKey,
					});
					navigate({ to: "/media" });
				});
		},
	});

	return (
		<div>
			<form.AppForm>
				<div className="flex justify-between items-center">
					<div className="font-bold text-xl mb-4">Update Media</div>
					<form.AppField
						name="isPrivate"
						children={({ SwitchField }) => <SwitchField label="Private?" />}
					/>
				</div>
				<form
					className="grid grid-cols-2 gap-x-6 gap-y-4"
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<div className="col-span-2">
						<form.AppField
							name="title"
							children={({ TextField }) => (
								<TextField withAsterisk label="Title" />
							)}
						/>
					</div>
					<form.AppField
						name="type"
						children={({ SelectField }) => (
							<SelectField
								withAsterisk
								name="type"
								label="Media Type"
								placeholder="Select a media type"
								options={[
									{ label: "Movie", value: "Movie" },
									{ label: "Show", value: "Show" },
									{ label: "Game", value: "Game" },
									{ label: "Book", value: "Book" },
								]}
							/>
						)}
					/>
					<form.AppField
						name="genre"
						children={({ TextField }) => (
							<TextField label="Genre" placeholder="Enter the genre" />
						)}
					/>
					<form.AppField
						name="startDate"
						children={({ DatePickerField }) => (
							<DatePickerField label="Start Date" />
						)}
					/>
					<form.Subscribe
						selector={(state) => state.values.status}
						children={(status) => (
							<form.AppField
								name="completedDate"
								children={({ DatePickerField }) => (
									<DatePickerField
										withAsterisk={status === "Completed"}
										label="Completed Date"
									/>
								)}
							/>
						)}
					/>

					<div className="col-span-2">
						<form.AppField
							name="status"
							listeners={{
								onChange: () => {
									form.validateField("completedDate", "change");
								},
							}}
							children={({ SelectField }) => (
								<SelectField
									withAsterisk
									name="status"
									label="Status"
									placeholder="Select a status"
									options={[
										{ label: "Completed", value: "Completed" },
										{
											label: "In Progress",
											value: "In Progress",
										},
										{ label: "Planned", value: "Planned" },
										{ label: "Dropped", value: "Dropped" },
									]}
								/>
							)}
						/>
					</div>
					<form.AppField
						name="platform"
						children={({ TextField }) => (
							<TextField label="Platform" placeholder="Enter the platform" />
						)}
					/>
					<form.AppField
						name="recommended"
						children={({ BooleanField }) => (
							<BooleanField
								label="Recommended"
								name="recommended"
								placeholder="Yes/No"
							/>
						)}
					/>
					<div className="col-span-2">
						<form.AppField
							name="comments"
							children={({ TiptapField }) => <TiptapField label="Comments" />}
						/>
					</div>
					<div className="col-span-2 mx-auto">
						<form.AppField
							name="rating"
							children={({ RatingField }) => <RatingField size={32} />}
						/>
					</div>
					<div className="col-span-2">
						<form.SubmitButton text="Submit" />
					</div>
				</form>
			</form.AppForm>
		</div>
	);
}
