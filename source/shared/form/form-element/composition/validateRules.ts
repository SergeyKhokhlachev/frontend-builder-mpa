export const useValidateRules = {
	empty: {
		validate($field: HTMLInputElement | HTMLTextAreaElement): boolean {
			return $field.value.length > 0;
		},
	},
	text: {
		validate($field: HTMLInputElement): boolean {
			return $field.value.length > 1;
		},
	},
	email: {
		validate($field: HTMLInputElement): boolean {
			const reg =
				/^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/i;
			return reg.test(String($field.value).toLowerCase());
		},
	},
	password: {
		validate($field: HTMLInputElement): boolean {
			return $field.value.length > 7;
		},
	},
	textarea: {
		validate($field: HTMLTextAreaElement): boolean {
			return $field.value.length > 1 && $field.value.length <= 150;
		},
	},
	conform: {
		validate($field: HTMLInputElement): boolean {
			const sample: HTMLInputElement | undefined = document.querySelector(
				$field.dataset.conform,
			);
			const value = sample?.value || '';
			return $field.value === value;
		},
	},
	mask: {
		validate($field: any): boolean {
			return $field.inputmask.isComplete();
		},
	},
	tel: {
		validate($field: any): boolean {
			return $field.inputmask.isComplete();
		},
	},
	date: {
		validate($field: any): boolean {
			return $field.inputmask.isComplete();
		},
	},
};
