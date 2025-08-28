import { useAppForm } from "@/hooks/form";
import { authClient } from "@/lib/auth/auth-client";
import { authQueryOptions } from "@/lib/auth/queries";
import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { GalleryVerticalEnd } from "lucide-react";
import { useState } from "react";
import z from "zod/v4";

export const Route = createFileRoute("/(auth)/signup")({
	component: SignupForm,
});

const signUpSchema = z
	.object({
		name: z.string().min(3, "Name must be at least three characters long"),
		username: z
			.string()
			.min(3, "Username must be at least three characters long"),
		email: z.email("Invalid Email"),
		password: z.string(),
		confirmPassword: z.string(),
	})
	.refine((val) => val.password === val.confirmPassword, {
		path: ["password"],
	});

function SignupForm() {
	const { redirectUrl } = Route.useRouteContext();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const [errorMessage, setErrorMessage] = useState("");

	const form = useAppForm({
		defaultValues: {
			name: "",
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
		validators: {
			onChange: signUpSchema,
		},
		onSubmit: ({ value }) => {
			authClient.signUp.email(
				{
					name: value.name,
					username: value.username,
					email: value.email,
					password: value.password,
					callbackURL: redirectUrl,
				},
				{
					onError: (ctx) => {
						setErrorMessage(ctx.error.message);
					},
					onSuccess: () => {
						queryClient.removeQueries({
							queryKey: authQueryOptions().queryKey,
						});
						navigate({ to: redirectUrl });
					},
				},
			);
		},
	});

	return (
		<div className="flex flex-col gap-6">
			<form.AppForm>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<div className="flex flex-col gap-6">
						<div className="flex flex-col items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-md">
								<GalleryVerticalEnd className="size-6" />
							</div>
							<span className="sr-only">Acme Inc.</span>
							<h1 className="text-xl font-bold">Sign up for Media Voyage</h1>
						</div>
						<div className="flex flex-col gap-5">
							<form.AppField
								name="name"
								children={({ TextField }) => {
									return <TextField label="Name" placeholder="John Doe" />;
								}}
							/>
							<form.AppField
								name="username"
								children={({ TextField }) => (
									<TextField label="Username" placeholder="Username" />
								)}
							/>
							<form.AppField
								name="email"
								children={({ TextField }) => {
									return (
										<TextField label="Email" placeholder="hello@example.com" />
									);
								}}
							/>
							<form.AppField
								name="password"
								children={({ TextField }) => {
									return (
										<TextField
											type="password"
											label="Password"
											placeholder="Password"
										/>
									);
								}}
							/>
							<form.AppField
								name="confirmPassword"
								children={({ TextField }) => {
									return (
										<TextField
											label="Confirm Password"
											placeholder="Confirm Password"
										/>
									);
								}}
							/>
							<form.SubmitButton text="Sign up" />
						</div>
						{errorMessage && (
							<span className="text-destructive text-center text-sm">
								{errorMessage}
							</span>
						)}
						<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
							<span className="bg-background text-muted-foreground relative z-10 px-2">
								Or
							</span>
						</div>
					</div>
				</form>
			</form.AppForm>

			<div className="text-center text-sm">
				Already have an account?{" "}
				<Link to="/login" className="underline underline-offset-4">
					Login
				</Link>
			</div>
		</div>
	);
}
