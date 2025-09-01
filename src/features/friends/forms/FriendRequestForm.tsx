import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useMutation } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import { sendFriendReqMutOptions } from "../queries/friendQueries";

export function FriendRequestForm() {
	const [text, setText] = useState("");
	const { user } = useRouteContext({ strict: false });
	const mutation = useMutation(sendFriendReqMutOptions());
	const [errorMessage, setErrorMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		if (text === "") {
			setErrorMessage("Enter an email or username");
			return;
		}

		setLoading(true);

		try {
			await mutation.mutateAsync({
				uid: user!.id,
				friendData: text,
			});
		} catch (err) {
			if (err instanceof Error) {
				setErrorMessage(err.message);
			}
		}

		setLoading(false);
	};

	return (
		<div className="grid">
			<div className="grid gap-2">
				<Label>Email/Username</Label>
				<Input
					disabled={loading}
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder="Email/Username"
				/>
				{errorMessage && (
					<div className="text-destructive text-sm font-bold">
						{errorMessage}
					</div>
				)}
			</div>
			<Button className="mt-4" onClick={handleSubmit} disabled={loading}>
				{loading && <LoaderCircleIcon className="animate-spin" />}
				Send Friend Request
			</Button>
		</div>
	);
}
