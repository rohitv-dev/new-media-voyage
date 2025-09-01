import { useAppForm } from "@/hooks/form";
import { authClient } from "@/lib/auth/auth-client";
import { Link, createFileRoute } from "@tanstack/react-router";
import { GalleryVerticalEnd } from "lucide-react";
import { useState } from "react";
import z from "zod/v4";

export const Route = createFileRoute("/(auth)/login")({
	component: LoginForm,
});

const loginSchema = z
	.object({
		email: z.email().or(z.literal("")),
		username: z.string().or(z.literal("")),
		password: z
			.string()
			.min(6, "Password must be at least six characters long"),
	})
	.refine((val) => val.email || val.username, {
		message: "Either email or username is required",
		path: ["email"],
	});

function LoginForm() {
	const { redirectUrl } = Route.useRouteContext();

	const form = useAppForm({
		defaultValues: {
			email: "",
			username: "",
			password: "",
		},
		validators: {
			onSubmit: loginSchema,
		},
		onSubmit: ({ value }) => {
			if (value.email) {
				authClient.signIn.email(
					{
						email: value.email,
						password: value.password,
						callbackURL: redirectUrl,
					},
					{
						onError: (ctx) => {
							console.log(ctx.error);
							setErrorMessage(ctx.error.message);
						},
					},
				);
			} else if (value.username) {
				authClient.signIn.username(
					{
						username: value.username,
						password: value.password,
						callbackURL: redirectUrl,
					},
					{
						onError: (ctx) => {
							console.log(ctx.error);
							setErrorMessage(ctx.error.message);
						},
					},
				);
			}
		},
	});

	console.log(loginSchema.safeParse(form.state.values));

	const [errorMessage, setErrorMessage] = useState("");

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
							<span className="sr-only">Media Voyage</span>
							<h1 className="text-xl font-bold">
								Welcome back to Media Voyage
							</h1>
						</div>
						<div>
							<form.Subscribe
								selector={(state) => state.values.username}
								children={(username) => (
									<form.AppField
										name="email"
										children={({ TextField }) => (
											<TextField
												disabled={username !== ""}
												label="Email"
												placeholder="hello@example.com"
											/>
										)}
									/>
								)}
							/>
							<div className="text-center text-sm text-muted-foreground pt-2">
								(or)
							</div>
							<form.Subscribe
								selector={(state) => state.values.email}
								children={(email) => (
									<form.AppField
										name="username"
										children={({ TextField }) => (
											<TextField
												disabled={email !== ""}
												label="Username"
												placeholder="Username"
											/>
										)}
									/>
								)}
							/>
						</div>
						<form.AppField
							name="password"
							children={({ TextField }) => (
								<TextField
									type="password"
									label="Password"
									placeholder="Enter password here"
								/>
							)}
						/>
						<div className="flex flex-col gap-5">
							<form.SubmitButton text="Login" />
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
				Don&apos;t have an account?{" "}
				<Link to="/signup" className="underline underline-offset-4">
					Sign up
				</Link>
			</div>
		</div>
	);
}
