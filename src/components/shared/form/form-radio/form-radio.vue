<template>
	<div
		:class="['form-radio', { valid: viewResult.complete }, { error: viewResult.error }, { disabled: disabled }]"
		:aria-required="required"
		:aria-invalid="!viewResult.valid"
	>
		<div v-if="legend" class="form-radio__legend">
			{{ legend }}
			<span v-if="required" class="form-radio__required" aria-hidden="true">*</span>
		</div>
		<div v-for="option in options" :key="option.id" class="form-radio__element">
			<div class="form-radio__control">
				<input
					:id="option.id"
					:value="option.value"
					:checked="modelValue === option.value"
					type="radio"
					:name="name"
					:required="required"
					:disabled="disabled"
					class="form-radio__input"
					@change="changeHandler"
				/>
				<div class="form-radio__vue"></div>
			</div>
			<label v-if="option.label" class="form-radio__label" :for="option.id">
				<slot name="label" :option="option">{{ option.label }}</slot>
			</label>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getValidateBox } from '@/components/shared/form/common/validate';
import type { ResultValidate, SelectionOption } from '@/components/shared/form/form.types';

const props = withDefaults(
	defineProps<{
		id: string;
		name: string;
		options: Array<SelectionOption>;
		modelValue?: string;
		legend?: string;
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

const viewResult = ref<ResultValidate>({ valid: false, error: false });

const validate = (draw: boolean = true, empty: boolean = false, value: string = props.modelValue): boolean => {
	const checked = props.options.some((option) => option.value === value);
	const result = getValidateBox(checked, empty, props.required);

	if (draw) viewResult.value = result;

	emit('validate', result.valid);
	return result.valid;
};

const changeHandler = (event: Event) => {
	const target = event.target as HTMLInputElement;
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
