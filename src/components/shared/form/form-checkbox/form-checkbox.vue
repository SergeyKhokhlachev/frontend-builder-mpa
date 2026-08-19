<template>
	<div :class="['form-checkbox', { valid: viewResult.complete }, { error: viewResult.error }, { disabled: disabled }]">
		<div class="form-checkbox__control">
			<input
				:id="id"
				:checked="modelValue"
				type="checkbox"
				:name="name"
				:required="required"
				:disabled="disabled"
				:aria-required="required"
				:aria-invalid="!viewResult.valid"
				class="form-checkbox__input"
				@change="changeHandler"
			/>
			<div class="form-checkbox__vue">
				<i class="icon icon-check" aria-hidden="true"></i>
			</div>
		</div>
		<label v-if="label" class="form-checkbox__label" :for="id">
			<slot></slot>
		</label>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getValidateBox } from '@/components/shared/form/common/validate';
import type { ResultValidate } from '@/components/shared/form/form.types';

const props = withDefaults(
	defineProps<{
		id: string;
		name: string;
		modelValue?: boolean;
		label?: boolean;
		value?: string;
		required?: boolean;
		disabled?: boolean;
	}>(),
	{
		modelValue: true,
		label: true,
		required: false,
		disabled: false,
	},
);

const emit = defineEmits<{
	'update:modelValue': [value: boolean];
	validate: [value: boolean];
}>();

const viewResult = ref<ResultValidate>({ valid: false, error: false, complete: false });

const validate = (draw: boolean = true, empty: boolean = false, value: boolean = props.modelValue): boolean => {
	const result = getValidateBox(value, empty, props.required);

	if (draw) viewResult.value = result;

	emit('validate', result.valid);
	return result.valid;
};

const changeHandler = (event: Event) => {
	const target = event.target as HTMLInputElement;
	emit('update:modelValue', target.checked);
	validate(true, true, target.checked);
};

onMounted(() => {
	validate(false);
});

defineExpose({
	validate,
});
</script>
