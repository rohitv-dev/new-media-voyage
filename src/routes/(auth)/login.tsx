import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { authClient } from "@/lib/auth/auth-client";
import { Link, createFileRoute } from "@tanstack/react-router";
import { GalleryVerticalEnd, LoaderCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/(auth)/login")({
	component: LoginForm,
});

function LoginForm() {
	const { redirectUrl } = Route.useRouteContext();

	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isLoading) return;

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		if (!email || !password) return;

		setIsLoading(true);
		setErrorMessage("");

		authClient.signIn.email(
			{
				email,
				password,
				callbackURL: redirectUrl,
			},
			{
				onError: (ctx) => {
					console.log(ctx.error);
					setErrorMessage(ctx.error.message);
					setIsLoading(false);
				},
				// better-auth seems to trigger a hard navigation on login,
				// so we don't have to revalidate & navigate ourselves
				// onSuccess: () => {
				//   queryClient.removeQueries({ queryKey: authQueryOptions().queryKey });
				//   navigate({ to: redirectUrl });
				// },
			},
		);
	};

	return (
		<div className="flex flex-col gap-6">
			<form onSubmit={handleSubmit}>
				<div className="flex flex-col gap-6">
					<div className="flex flex-col items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-md">
							<GalleryVerticalEnd className="size-6" />
						</div>
						<span className="sr-only">Acme Inc.</span>
						<h1 className="text-xl font-bold">Welcome back to Acme Inc.</h1>
					</div>
					<div className="flex flex-col gap-5">
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="hello@example.com"
								readOnly={isLoading}
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="Enter password here"
								readOnly={isLoading}
								required
							/>
						</div>
						<Button
							type="submit"
							className="mt-2 w-full"
							size="lg"
							disabled={isLoading}
						>
							{isLoading && <LoaderCircle className="animate-spin" />}
							{isLoading ? "Logging in..." : "Login"}
						</Button>
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

			<div className="text-center text-sm">
				Don&apos;t have an account?{" "}
				<Link to="/signup" className="underline underline-offset-4">
					Sign up
				</Link>
			</div>
		</div>
	);
}
