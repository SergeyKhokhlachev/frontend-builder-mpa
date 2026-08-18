export interface FormComponent {
	destroy?: () => void;
	validate: (render?: boolean, empty?: boolean) => boolean;
}

export interface ValidationRule {
	validate(value: string): boolean;
}

export interface ResultValidate {
	valid: boolean;
	error: boolean;
	complete?: boolean;
	message?: string;
}

export interface ViewFileOptions {
	id: string;
	name: string;
	ext: string;
	src: string | ArrayBuffer | null;
	img: boolean;
}

export interface ViewSelectOptions {
	id: string;
	expanded: boolean;
	current: number;
}

export interface SelectionOption {
	id: string;
	value: string;
	label: string;
	param?: string;
}

interface FieldProps {
	id: string;
	name: string;
	required?: boolean;
	disabled?: boolean;
}

interface InputProps extends FieldProps {
	type?: string;
	label?: string;
	describe?: string;
	placeholder?: string;
	autocomplete?: string;
	message?: string;
	rule?: string;
}

interface TextareaProps extends FieldProps {
	label?: string;
	describe?: string;
	placeholder?: string;
	autocomplete?: string;
}

interface SelectProps extends FieldProps {
	options: SelectionOption[];
	label?: string;
	describe?: string;
	placeholder?: string;
}

interface CompleteProps extends FieldProps {
	options?: SelectionOption[];
	label?: string;
	describe?: string;
	placeholder?: string;
	filtred?: boolean;
}

interface FileProps extends FieldProps {
	label?: string;
	describe?: string;
	placeholder?: string;
	title?: string;
	text?: string;
	size?: number;
	length?: number;
	accept?: string;
	multiple?: boolean;
}

interface CodeProps extends FieldProps {
	label?: string;
	describe?: string;
	required?: boolean;
	disabled?: boolean;
	length?: number;
}

interface CheckboxProps extends FieldProps {
	label?: boolean;
}

interface RadioProps extends FieldProps {
	options: SelectionOption[];
	legend?: string;
}

interface FieldSchemaMap {
	input: InputProps;
	textarea: TextareaProps;
	select: SelectProps;
	complete: CompleteProps;
	file: FileProps;
	code: CodeProps;
	radio: RadioProps;
	checkbox: CheckboxProps;
}

export type FieldSchema<T extends keyof FieldSchemaMap> = FieldSchemaMap[T];

// handleres
export interface FormChangeDetail {
	valid: boolean;
}

export interface ElementValidateDetail {
	valid: boolean;
}

export interface ElementChangeDetail {
	value: string | boolean | File[];
}

export type FormChangeEvent = CustomEvent<FormChangeDetail>;
export type ElementValidateEvent = CustomEvent<ElementValidateDetail>;
export type ElementChangeEvent = CustomEvent<ElementChangeDetail>;

declare global {
	interface HTMLElementEventMap {
		formChange: FormChangeEvent;
		elementValidate: ElementValidateEvent;
		elementChange: ElementChangeEvent;
	}
}
