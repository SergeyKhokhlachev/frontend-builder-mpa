<script>
import { ref, onBeforeUpdate } from 'vue';

export { default as FormCheckbox } from '@/components/shared/form/form-checkbox/form-checkbox.vue';
export { default as FormCode } from '@/components/shared/form/form-code/form-code.vue';
export { default as FormFile } from '@/components/shared/form/form-file/form-file.vue';
export { default as FormInput } from '@/components/shared/form/form-input/form-input.vue';
export { default as FormRadio } from '@/components/shared/form/form-radio/form-radio.vue';
export { default as FormSelect } from '@/components/shared/form/form-select/form-select.vue';
export { default as FormComplete } from '@/components/shared/form/form-select/form-complete.vue';
export { default as FormTextarea } from '@/components/shared/form/form-textarea/form-textarea.vue';

export function useForm() {
	const formMapRefs = ref(new Map());
	const setFieldRef = (key, el) => {
		if (el) {
			formMapRefs.value.set(key, el);
		} else {
			formMapRefs.value.delete(key);
		}
	};

	onBeforeUpdate(() => {
		formMapRefs.value.clear();
	});

	const checkForm = async (fields = []) => {
		let isValid = true;

		const fieldsToValidate = fields.length ? fields : Array.from(formMapRefs.value.keys());

		for (const key of fieldsToValidate) {
			const component = formMapRefs.value.get(key);
			if (component && typeof component.validate === 'function') {
				const result = await component.validate();
				if (!result) isValid = false;
			}
		}

		return isValid;
	};

	return {
		formMapRefs,
		setFieldRef,
		checkForm,
	};
}
</script>
