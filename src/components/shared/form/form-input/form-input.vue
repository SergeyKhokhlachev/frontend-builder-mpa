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
		<div class="form-element__field">
			<input
				:id="id"
				:value="modelValue"
				:type="computedType"
				:name="name"
				:placeholder="placeholder"
				:autocomplete="autocomplete"
				:required="required"
				:disabled="disabled"
				:maxlength="type === 'tel' ? 18 : undefined"
				:aria-describedby="`${id}-error`"
				:aria-invalid="!viewResult.valid"
				:aria-required="required"
				class="form-input"
				@input="inputHandler"
				@focus="focus = !viewResult.error ? true : false"
				@blur="focus = false"
			/>
			<div
				v-if="type === 'password'"
				:class="['form-element__icon', { shown: showPassword }]"
				@click="showPassword = !showPassword"
			>
				<i :class="['form-element__icon-show', 'icon', `icon-eye-close`]" aria-hidden="true"></i>
				<i :class="['form-element__icon-hide', 'icon', `icon-eye-open`]" aria-hidden="true"></i>
			</div>
		</div>
	</form-element>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import FormElement from '@/components/shared/form/form-element/form-element.vue';
import { getValidateInput } from '@/components/shared/form/composition/helpers';
import { getFormatPhone } from '@/components/shared/form/composition/formatting';
import type { ResultValidate } from '@/components/shared/form/form.types';

const props = withDefaults(
	defineProps<{
		id: string;
		name: string;
		modelValue?: string;
		type?: string;
		label?: string;
		describe?: string;
		placeholder?: string;
		autocomplete?: string;
		required?: boolean;
		disabled?: boolean;
		message?: string;
		rule?: string;
	}>(),
	{
		type: 'text',
		modelValue: '',
		autocomplete: 'on',
		required: false,
		disabled: false,
	},
);

const emit = defineEmits<{
	'update:modelValue': [value: string];
	validate: [value: boolean];
}>();

const rule = props.rule || props.type;
const message = props.message || props.type;

const focus = ref(false);
const viewResult = ref<ResultValidate>({ valid: false, error: false, complete: false, message: '' });
const showPassword = ref(false);

const computedType = computed(() => {
	return props.type === 'password' && showPassword.value ? 'text' : props.type;
});

const validate = (draw: boolean = true, empty: boolean = false, value: string = props.modelValue): boolean => {
	const result = getValidateInput(rule, message, value, empty, props.required);

	if (draw) viewResult.value = result;

	emit('validate', result.valid);
	return result.valid;
};

const inputHandler = (event: Event) => {
	const target = event.target as HTMLInputElement;
	let value = target.value;

	if (props.type === 'tel') {
		value = getFormatPhone(target.value);
	}

	emit('update:modelValue', value);
	validate(true, true, value);
};

onMounted(() => {
	validate(false, true);
});

defineExpose({
	validate,
});
</script>
