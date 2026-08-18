<template>
	<form-element
		:for-id="id"
		:error-id="`${id}-error`"
		:label="label"
		:describe="describe"
		:required="required"
		:disabled="disabled"
		:message="viewResult.message"
		:complete="viewResult.complete"
		:error="viewResult.error"
		:focus="focus"
	>
		<textarea
			:id="id"
			:name="name"
			:value="modelValue"
			:placeholder="placeholder"
			:autocomplete="autocomplete"
			:required="required"
			:disabled="disabled"
			:aria-describedby="`${id}-error`"
			:aria-invalid="!viewResult.valid"
			:aria-required="required"
			class="form-textarea"
			@input="inputHandler"
			@focus="focus = !viewResult.error ? true : false"
			@blur="focus = false"
		></textarea>
	</form-element>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import FormElement from '@/components/shared/form/form-element/form-element.vue';
import { getValidateInput } from '@/components/shared/form/composition/helpers';
import type { ResultValidate } from '@/components/shared/form/form.types';

const props = withDefaults(
	defineProps<{
		id: string;
		name: string;
		modelValue?: string;
		label?: string;
		describe?: string;
		placeholder?: string;
		autocomplete?: string;
		required?: boolean;
		disabled?: boolean;
	}>(),
	{
		modelValue: '',
		required: false,
		disabled: false,
	},
);

const emit = defineEmits<{
	'update:modelValue': [value: string];
	validate: [value: boolean];
}>();

const rule = 'textarea';
const message = 'textarea';
const focus = ref(false);
const viewResult = ref<ResultValidate>({ valid: false, error: false, complete: false, message: '' });

const validate = (draw: boolean = true, empty: boolean = false, value: string = props.modelValue): boolean => {
	const result = getValidateInput(rule, message, value, empty, props.required);

	if (draw) viewResult.value = result;

	emit('validate', result.valid);
	return result.valid;
};

const inputHandler = (event: Event) => {
	const target = event.target as HTMLTextAreaElement;
	emit('update:modelValue', target.value);
	validate(true, true, target.value);
};

onMounted(() => {
	validate(false);
});

defineExpose({
	validate,
});
</script>
