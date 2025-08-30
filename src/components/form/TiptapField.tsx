import { useFieldContext } from "@/hooks/formContext";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	AlignCenterIcon,
	AlignJustifyIcon,
	AlignLeftIcon,
	AlignRightIcon,
	BoldIcon,
	ItalicIcon,
	ListOrderedIcon,
	ListTreeIcon,
	PenLineIcon,
	UnderlineIcon,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Label } from "../ui/Label";

const Icon = ({
	children,
	onClick,
}: { children: React.ReactNode; onClick: () => void }) => (
	<Button
		type="button"
		variant="outline"
		className="h-6 w-6 rounded-none"
		onClick={onClick}
		onKeyDown={(e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onClick();
			}
		}}
		tabIndex={0}
		aria-label="icon button"
	>
		{children}
	</Button>
);

interface TiptapFieldProps {
	label: string;
}

export const TiptapField = ({ label }: TiptapFieldProps) => {
	const field = useFieldContext<string>();

	const editor = useEditor({
		immediatelyRender: false,
		editorProps: {
			attributes: {
				class: "prose focus:outline-none",
			},
		},
		extensions: [StarterKit, TextAlign],
		content: field.state.value || "<p></p>",

		onUpdate: ({ editor }) => {
			const html = editor.getHTML();
			field.handleChange(html);
		},
	});

	if (!editor) return null;

	return (
		<>
			<Label>{label}</Label>

			<div className="flex gap-2 mt-2">
				<div className="flex">
					<Icon onClick={() => editor.chain().focus().toggleBold().run()}>
						<BoldIcon />
					</Icon>
					<Icon onClick={() => editor.chain().focus().toggleItalic().run()}>
						<ItalicIcon />
					</Icon>
					<Icon onClick={() => editor.chain().focus().toggleUnderline().run()}>
						<UnderlineIcon />
					</Icon>
				</div>
				<div className="flex">
					<Icon
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 1 }).run()
						}
					>
						H1
					</Icon>
					<Icon
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 2 }).run()
						}
					>
						H2
					</Icon>
					<Icon
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 3 }).run()
						}
					>
						H3
					</Icon>
					<Icon
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 4 }).run()
						}
					>
						H4
					</Icon>
				</div>
				<div className="flex">
					<Icon onClick={() => editor.chain().focus().toggleBulletList().run()}>
						<ListTreeIcon />
					</Icon>
					<Icon
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
					>
						<ListOrderedIcon />
					</Icon>
				</div>
				<div className="flex">
					<Icon
						onClick={() => editor.chain().focus().setHorizontalRule().run()}
					>
						<PenLineIcon />
					</Icon>
				</div>
				<div className="flex">
					<Icon
						onClick={() => editor.chain().focus().setTextAlign("left").run()}
					>
						<AlignLeftIcon />
					</Icon>
					<Icon
						onClick={() => editor.chain().focus().setTextAlign("center").run()}
					>
						<AlignCenterIcon />
					</Icon>
					<Icon
						onClick={() => editor.chain().focus().setTextAlign("right").run()}
					>
						<AlignRightIcon />
					</Icon>
					<Icon
						onClick={() => editor.chain().focus().setTextAlign("justify").run()}
					>
						<AlignJustifyIcon />
					</Icon>
				</div>
			</div>

			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div
				className="border mt-2 h-40 p-1 cursor-text"
				onClick={() => editor.chain().focus().run()}
			>
				<EditorContent editor={editor} className="h-full" />
			</div>
		</>
	);
};
