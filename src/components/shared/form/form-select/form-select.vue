<template>
	<form-element
		:id="`${id}-label`"
		:for-id="`${id}-trigger`"
		:error-id="`${id}-error`"
		:label="label"
		:describe="describe"
		:required="required"
		:disabled="disabled"
		:message="viewResult.message"
		:valid="viewResult.valid"
		:error="viewResult.error"
	>
		<div :class="['form-select', { active: viewSelect.expanded }]" @keydown="keydownHandler">
			<input :name="name" :value="modelValue" type="hidden" />
			<button
				:id="`${id}-trigger`"
				ref="triggerRef"
				type="button"
				role="combobox"
				:disabled="disabled"
				aria-haspopup="listbox"
				:aria-label="label ? undefined : 'Выберите значение из списка'"
				:aria-expanded="viewSelect.expanded"
				:aria-labelledby="`${id}-label`"
				:aria-controls="`${id}-dropdown`"
				:aria-describedby="`${id}-error`"
				:aria-required="required"
				:aria-invalid="!viewResult.valid"
				:class="['form-select__control', { placeholder: !selectedOption }]"
				@click="toggleHandler"
			>
				<span class="form-select__placeholder">{{ placeholder }}</span>
				<span class="form-select__vue">{{ selectedOption?.label || '' }}</span>
				<i class="form-select__icon icon icon-chevron-down" aria-hidden="true"></i>
			</button>

			<ul
				:id="`${id}-dropdown`"
				ref="dropdownRef"
				role="listbox"
				:aria-labelledby="`${id}-label`"
				tabindex="-1"
				:aria-activedescendant="activeDescendantId"
				class="form-select__dropdown"
				@mouseleave="clearOptionFocus"
			>
				<li
					v-for="(option, index) in options"
					:id="`${id}-opt-${index}`"
					:key="option.id"
					ref="optionRefs"
					role="option"
					:aria-selected="modelValue === option.value"
					:data-value="option.value"
					:class="['form-select__option', { focused: index === viewSelect.current, selected: modelValue === option.value }]"
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
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue';
import FormElement from '@/components/shared/form/form-element/form-element.vue';
import { getValidateSelect } from '@/components/shared/form/common/validate';
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

const message = 'select';

const viewResult = ref<ResultValidate>({ valid: false, error: false, message: '' });
const viewSelect = ref<ViewSelectOptions>({ id: '', expanded: false, current: -1 });

const triggerRef = ref<HTMLButtonElement | null>(null);
const dropdownRef = ref<HTMLUListElement | null>(null);
const optionRefs = ref<HTMLLIElement[]>([]);

const selectedOption = computed(() => {
	return props.options.find((opt) => opt.value === props.modelValue) || null;
});

const activeDescendantId = computed(() => {
	return viewSelect.value.current >= 0 ? `${props.id}-opt-${viewSelect.value.current}` : '';
});

const validate = (draw: boolean = true, empty: boolean = false, value: string = props.modelValue): boolean => {
	const checked = props.options.some((option) => value === option.value);
	const result = getValidateSelect(message, checked, empty, props.required);

	if (draw) viewResult.value = result;

	emit('validate', result.valid);
	return result.valid;
};

const toggleDropdown = (show?: boolean) => {
	if (props.disabled) return;

	viewSelect.value.expanded = show !== undefined ? show : !viewSelect.value.expanded;

	if (viewSelect.value.expanded) {
		const selectedIndex = props.options.findIndex((opt) => opt.value === props.modelValue);
		viewSelect.value.current = selectedIndex !== -1 ? selectedIndex : -1;

		if (selectedIndex !== -1) {
			nextTick(() => scrollIntoView(selectedIndex));
		}
	} else {
		clearOptionFocus();
		if (document.activeElement && dropdownRef.value?.contains(document.activeElement)) {
			triggerRef.value?.focus();
		}
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
	emit('update:modelValue', option.value);
	toggleDropdown(false);
	validate(true, true, option.value);
};

const toggleHandler = () => {
	toggleDropdown();
};

const keydownHandler = (event: KeyboardEvent) => {
	if (props.disabled) return;

	const totalOptions = props.options.length;
	if (totalOptions === 0) return;

	switch (event.key) {
		case 'Enter':
		case ' ':
			event.preventDefault();
			if (viewSelect.value.expanded && viewSelect.value.current !== -1) {
				selectOption(props.options[viewSelect.value.current]);
			} else {
				toggleDropdown(true);
			}
			break;

		case 'ArrowDown':
			event.preventDefault();
			if (!viewSelect.value.expanded) {
				toggleDropdown(true);
			} else {
				highlightOption((viewSelect.value.current + 1) % totalOptions);
				scrollIntoView(viewSelect.value.current);
			}
			break;

		case 'ArrowUp':
			event.preventDefault();
			if (!viewSelect.value.expanded) {
				toggleDropdown(true);
			} else {
				highlightOption((viewSelect.value.current - 1 + totalOptions) % totalOptions);
				scrollIntoView(viewSelect.value.current);
			}
			break;

		case 'Escape':
			if (viewSelect.value.expanded) {
				event.preventDefault();
				toggleDropdown(false);
				triggerRef.value?.focus();
			}
			break;

		case 'Tab':
			if (viewSelect.value.expanded) {
				toggleDropdown(false);
			}
			break;

		case 'Home':
			if (viewSelect.value.expanded) {
				event.preventDefault();
				highlightOption(0);
				scrollIntoView(viewSelect.value.current);
			}
			break;

		case 'End':
			if (viewSelect.value.expanded) {
				event.preventDefault();
				highlightOption(totalOptions - 1);
				scrollIntoView(viewSelect.value.current);
			}
			break;
	}
};

const clickOutsideHandler = (event: MouseEvent) => {
	const target = event.target as HTMLElement;
	if (viewSelect.value.expanded && triggerRef.value && dropdownRef.value) {
		if (!triggerRef.value.contains(target) && !dropdownRef.value.contains(target)) {
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
