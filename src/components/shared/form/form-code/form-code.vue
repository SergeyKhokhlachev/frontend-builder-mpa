<template>
	<form-element
		:id="`${id}-label`"
		:for-id="`${id}-digit-1`"
		:error-id="`${id}-error`"
		:label="label"
		:describe="describe"
		:required="required"
		:disabled="disabled"
		:message="viewResult.message"
		:valid="viewResult.valid"
		:error="viewResult.error"
	>
		<div class="form-code">
			<input :id="id" type="hidden" :name="name" :value="modelValue" :required="required" tabindex="-1" />
			<div class="form-code__vue" role="group" :aria-labelledby="`${id}-label`">
				<template v-for="n in length" :key="n">
					<input
						:id="`${id}-digit-${n}`"
						ref="inputs"
						:value="codeArray[n - 1] || ''"
						class="form-input"
						type="tel"
						:name="`${name}-digit-${n}`"
						inputmode="numeric"
						maxlength="1"
						autocomplete="one-time-code"
						:required="required"
						:disabled="disabled"
						:aria-describedby="`${id}-error`"
						:aria-invalid="!viewResult.valid"
						:aria-required="required"
						:aria-label="`Цифра кода ${n}`"
						@input="inputCode($event, n - 1)"
						@keydown="keydownCode($event, n - 1)"
						@paste="pasteHandler"
					/>
				</template>
			</div>
		</div>
	</form-element>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import FormElement from '@/components/shared/form/form-element/form-element.vue';
import { getValidateCode } from '@/components/shared/form/common/validate';
import type { ResultValidate } from '@/components/shared/form/form.types';

const props = withDefaults(
	defineProps<{
		id: string;
		name: string;
		modelValue?: string;
		label?: string;
		length?: number;
		describe?: string;
		required?: boolean;
		disabled?: boolean;
	}>(),
	{
		modelValue: '',
		length: 6,
		required: false,
		disabled: false,
	},
);

const emit = defineEmits<{
	'update:modelValue': [value: string];
	validate: [value: boolean];
}>();

const message = 'code';
const viewResult = ref<ResultValidate>({ valid: false, error: false, complete: false, message: '' });

const inputs = ref<HTMLInputElement[]>([]);
const codeArray = computed(() => props.modelValue.split(''));

const validate = (draw: boolean = true, empty: boolean = false, value: string = props.modelValue): boolean => {
	const result = getValidateCode(message, value, empty, props.required, props.length);

	if (draw) viewResult.value = result;

	emit('validate', result.valid);
	return result.valid;
};

const updateCodeValue = (newValue: string) => {
	emit('update:modelValue', newValue);
	validate(true, true, newValue);
};

const inputCode = (event: Event, index: number) => {
	const target = event.target as HTMLInputElement;
	if (!/^\d+$/.test(target.value)) target.value = '';
	const newCode = [...codeArray.value];
	newCode[index] = target.value.slice(-1);

	updateCodeValue(newCode.slice(0, props.length).join(''));
	if (target.value && index < props.length - 1) nextTick(() => inputs.value[index + 1]?.focus());
};

const keydownCode = (event: KeyboardEvent, index: number) => {
	if (event.key === 'Backspace') {
		if (!codeArray.value[index] && index > 0) {
			event.preventDefault();
			const newCode = [...codeArray.value];
			newCode[index - 1] = '';

			updateCodeValue(newCode.join(''));
			nextTick(() => inputs.value[index - 1]?.focus());
		}
	} else if (event.key === 'ArrowLeft' && index > 0) {
		event.preventDefault();
		inputs.value[index - 1]?.focus();
	} else if (event.key === 'ArrowRight' && index < props.length - 1) {
		event.preventDefault();
		inputs.value[index + 1]?.focus();
	}
};

const pasteCode = (pasted: string) => {
	const digits = pasted.replace(/\D/g, '').slice(0, props.length);
	if (!digits) return;

	updateCodeValue(digits);
	const targetIndex = Math.min(digits.length, props.length - 1);
	nextTick(() => inputs.value[targetIndex]?.focus());
};

const pasteHandler = (event: ClipboardEvent) => {
	event.preventDefault();
	pasteCode(event.clipboardData?.getData('text') || '');
};

watch(
	() => props.length,
	() => {
		inputs.value = [];
	},
);

onMounted(() => {
	nextTick(() => {
		// if (!props.disabled && inputs.value.length > 0) {
		// 	inputs.value[0]?.focus();
		// }
		validate(false);
	});
});

defineExpose({
	validate,
});
</script>
