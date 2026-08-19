import type { ValidationRule } from '@/components/shared/form/form.types';

export const rules: Record<string, ValidationRule> = {
	text: {
		validate(value) {
			return value.trim().length > 1;
		},
	},
	email: {
		validate(value) {
			const reg = /.+@.+?\..{2,}$/;
			return reg.test(String(value).toLowerCase());
		},
	},
	tel: {
		validate(value) {
			return value.trim().length === 18;
		},
	},
	password: {
		validate(value) {
			return value.length > 5;
		},
	},
	index: {
		validate(value) {
			const reg = /^\d{6}$/;
			return reg.test(String(value).toLowerCase());
		},
	},
	textarea: {
		validate(value) {
			return value.trim().length > 1 && value.length <= 450;
		},
	},
};
