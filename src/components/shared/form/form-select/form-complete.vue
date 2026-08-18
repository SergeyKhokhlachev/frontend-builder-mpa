<template>
	<form-element
		:for-id="`${id}-trigger`"
		:error-id="`${id}-error`"
		:label="label"
		:describe="describe"
		:required="required"
		:disabled="disabled"
		:message="viewResult.message"
		:valid="viewResult.valid"
		:error="viewResult.error"
		:focus="focus"
	>
		<div :class="['form-select', { active: viewSelect.expanded }]" @keydown="keydownHandler">
			<input
				:id="`${id}-trigger`"
				ref="inputRef"
				type="text"
				:name="name"
				:value="modelValue"
				:disabled="disabled"
				:placeholder="placeholder"
				autocomplete="off"
				role="combobox"
				aria-haspopup="listbox"
				:aria-expanded="viewSelect.expanded"
				:aria-controls="`${id}-dropdown`"
				:aria-describedby="`${id}-error`"
				:aria-required="required"
				:aria-invalid="!viewResult.valid"
				:aria-activedescendant="activeDescendantId"
				class="form-select__control"
				@input="inputHandler"
				@focus="focusHandler"
				@blur="focus = false"
			/>
			<ul
				v-if="viewSelect.expanded && filteredOptions.length > 0"
				:id="`${id}-dropdown`"
				ref="dropdownRef"
				role="listbox"
				:aria-labelledby="`${id}-label`"
				tabindex="-1"
				class="form-select__dropdown"
				@mouseleave="clearOptionFocus"
			>
				<li
					v-for="(option, index) in filteredOptions"
					:id="`${id}-opt-${index}`"
					:key="option.id"
					ref="optionRefs"
					role="option"
					:aria-selected="modelValue === option.label"
					:data-value="option.value"
					:class="['form-select__option', { focused: index === viewSelect.current, selected: modelValue === option.label }]"
					@mouseenter="highlightOption(index)"
					@click.stop="selectOption(option)"
				>
					{{ option.label }}
				</li>
			</ul>
		</div>
	</form-element>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import FormElement from '@/components/shared/form/form-element/form-element.vue';
import { getValidateComplete } from '@/components/shared/form/composition/helpers';
import type { ResultValidate, ViewSelectOptions, SelectionOption } from '@/components/shared/form/form.types';

const props = withDefaults(
	defineProps<{
		id: string;
		name: string;
		options: Array<SelectionOption>;
		modelValue?: string;
		label?: string;
		describe?: string;
		placeholder?: string;
		empty?: string;
		filtred?: boolean;
		required?: boolean;
		disabled?: boolean;
	}>(),
	{
		modelValue: '',
		filtred: false,
		required: false,
		disabled: false,
	},
);

const emit = defineEmits<{
	'update:modelValue': [value: string];
	validate: [value: boolean];
	complete: [value: SelectionOption];
}>();

const message = 'complete';

const focus = ref(false);
const viewResult = ref<ResultValidate>({ valid: false, error: false, message: '' });
const viewSelect = ref<ViewSelectOptions>({ id: '', expanded: false, current: -1 });

const inputRef = ref<HTMLInputElement | null>(null);
const dropdownRef = ref<HTMLUListElement | null>(null);
const optionRefs = ref<HTMLLIElement[]>([]);

const filteredOptions = computed(() => {
	if (!props.modelValue || props.modelValue.length <= 2) return [];
	if (!props.filtred) return props.options;
	const search = props.modelValue.toLowerCase();
	return props.options.filter((opt) => opt.label.toLowerCase().includes(search));
});

const activeDescendantId = computed(() => {
	return viewSelect.value.current >= 0 ? `${props.id}-opt-${viewSelect.value.current}` : '';
});

const validate = (draw: boolean = true, empty: boolean = false, value: string = props.modelValue): boolean => {
	const checked = props.options.find((option) => value.toLowerCase() === option.label.toLowerCase());
	const result = getValidateComplete(message, value, !!checked, empty, props.required);

	if (draw) viewResult.value = result;

	emit('validate', result.valid);
	if (checked) emit('complete', checked);
	return result.valid;
};

const toggleDropdown = (show: boolean) => {
	if (props.disabled) return;

	viewSelect.value.expanded = show;

	if (viewSelect.value.expanded) {
		viewSelect.value.current = filteredOptions.value.length > 0 ? 0 : -1;
	} else {
		clearOptionFocus();
	}
};

const inputHandler = (event: Event) => {
	const target = event.target as HTMLInputElement;
	emit('update:modelValue', target.value);

	if (target.value.length > 2) {
		toggleDropdown(true);
	} else {
		toggleDropdown(false);
	}

	validate(true, true, target.value);
};

const focusHandler = () => {
	focus.value = !viewResult.value.error ? true : false;
	if (props.modelValue && props.modelValue.length > 2) {
		toggleDropdown(true);
	}
};

const highlightOption = (index: number) => {
	viewSelect.value.current = index;
};

const clearOptionFocus = () => {
	viewSelect.value.current = -1;
};

const scrollIntoView = (index: number) => {
	const element = optionRefs.value[index];
	if (element) {
		element.scrollIntoView({ block: 'nearest' });
	}
};

const selectOption = (option: SelectionOption) => {
	emit('update:modelValue', option.label);
	toggleDropdown(false);
	validate(true, true, option.label);
};

const keydownHandler = (event: KeyboardEvent) => {
	if (props.disabled) return;
	const totalOptions = filteredOptions.value.length;
	switch (event.key) {
		case 'Enter':
			if (viewSelect.value.expanded && viewSelect.value.current !== -1 && totalOptions > 0) {
				event.preventDefault();
				selectOption(filteredOptions.value[viewSelect.value.current]);
			}
			break;
		case 'ArrowDown':
			event.preventDefault();
			if (!viewSelect.value.expanded && props.modelValue && props.modelValue.length > 2) {
				toggleDropdown(true);
			} else if (viewSelect.value.expanded && totalOptions > 0) {
				highlightOption((viewSelect.value.current + 1) % totalOptions);
				scrollIntoView(viewSelect.value.current);
			}
			break;
		case 'ArrowUp':
			event.preventDefault();
			if (viewSelect.value.expanded && totalOptions > 0) {
				highlightOption((viewSelect.value.current - 1 + totalOptions) % totalOptions);
				scrollIntoView(viewSelect.value.current);
			}
			break;
		case 'Escape':
			if (viewSelect.value.expanded) {
				event.preventDefault();
				toggleDropdown(false);
				inputRef.value?.focus();
			}
			break;
		case 'Tab':
			toggleDropdown(false);
			break;
		case 'Home':
			if (viewSelect.value.expanded && totalOptions > 0) {
				event.preventDefault();
				highlightOption(0);
				scrollIntoView(viewSelect.value.current);
			}
			break;
		case 'End':
			if (viewSelect.value.expanded && totalOptions > 0) {
				event.preventDefault();
				highlightOption(totalOptions - 1);
				scrollIntoView(viewSelect.value.current);
			}
			break;
	}
};

const clickOutsideHandler = (event: MouseEvent) => {
	const target = event.target as HTMLElement;
	if (viewSelect.value.expanded && inputRef.value && dropdownRef.value) {
		if (!inputRef.value.contains(target) && !dropdownRef.value.contains(target)) {
			toggleDropdown(false);
		}
	}
};

onMounted(() => {
	validate(false);
	document.addEventListener('click', clickOutsideHandler);
});

onBeforeUnmount(() => {
	document.removeEventListener('click', clickOutsideHandler);
});

defineExpose({
	validate,
});
</script>
