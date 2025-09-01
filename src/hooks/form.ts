import { createFormHook } from "@tanstack/react-form";

import { BooleanField } from "@/components/form/BooleanField";
import { DatePickerField } from "@/components/form/DatePickerField";
import { RatingField } from "@/components/form/RatingField";
import { SelectField } from "@/components/form/SelectField";
import { SubmitButton } from "@/components/form/SubmitButton";
import { SwitchField } from "@/components/form/SwitchField";
import { TextField } from "@/components/form/TextField";
import { TiptapField } from "@/components/form/TiptapField";
import { fieldContext, formContext } from "./formContext";

export const { useAppForm } = createFormHook({
	fieldComponents: {
		TextField,
		SelectField,
		DatePickerField,
		BooleanField,
		TiptapField,
		SwitchField,
		RatingField,
	},
	formComponents: {
		SubmitButton,
	},
	fieldContext,
	formContext,
});
