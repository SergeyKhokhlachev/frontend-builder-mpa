<template>
	<form-element v-bind="$props" :message="messageComputed" :valid="valid" :error="error">
		<input
			:id="id"
			ref="element"
			class="form-input"
			:type="type"
			:name="name"
			:value="modelValue"
			:placeholder="placeholder"
			:autocomplete="autocomplete"
			:required="required"
			:data-rule="rule"
			:data-look="look"
			:data-mask="mask"
			@input="changeHandler"
			@change="changeHandler"
		/>
		<div v-if="icon" class="form-element__icon">
			<i :class="'icon icon-' + icon"></i>
		</div>
	</form-element>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { classInstance } from '@/shared/helpers/helpers';

import FormElement from '../form-element.vue';

import { useElementChange, useElementComplete } from '../composition/elementEvents';
import { useGetValid } from './composition/getValid';
import { useAppendMask } from './composition/appendMask';
import { useRemoveMask } from './composition/removeMask';

export default defineComponent({
	name: 'FormInput',
	components: {
		FormElement,
	},
	props: {
		id: { type: String, default: '' },
		type: { type: String, default: 'text' },
		name: { type: String, default: '' },
		modelValue: { type: String, default: '' },
		label: { type: String, default: '' },
		message: { type: String, default: 'text' },
		describe: { type: String, default: '' },
		placeholder: { type: String, default: '' },
		autocomplete: { type: String, default: '' },
		required: { type: Boolean, default: false },
		readonly: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },
		look: { type: Boolean, default: false },
		rule: { type: String, default: 'text' },
		mask: { type: String, default: '' },
		icon: { type: String, default: '' },
	},
	emits: ['update:modelValue'],
	data() {
		return {
			valid: false,
			error: false,
			messageComputed: '',
		};
	},
	mounted() {
		classInstance.set(this.$refs.element, { formElement: this });
		if (this.mask) useAppendMask(this.$refs.element);
	},
	beforeUnmount() {
		classInstance.del(this.$refs.element, 'formElement');
		if (this.mask) useRemoveMask(this.$refs.element);
	},
	methods: {
		validate(options: OptionsVE = {}): boolean {
			const optionsValidate: OptionsVE = {
				noRender: options.noRender || false,
				noEmpty: options.noEmpty || false,
				rule: options.rule || this.rule,
				message: options.message || this.message,
			};

			const result: ResultVE = useGetValid(this.$refs.element, optionsValidate);

			if (result.message) this.messageComputed = result.message;
			if (result.valid && !result.error)
				useElementComplete(this.$refs.element, { value: this.modelValue });
			if (!optionsValidate.noRender) {
				this.valid = result.valid;
				this.error = result.error;
			}

			return result.valid;
		},

		changeHandler(event: InputEvent): void {
			const $target: HTMLInputElement = event.target as HTMLInputElement;
			this.$emit('update:modelValue', $target.value);
			setTimeout(() => useElementChange(this.$refs.element, { value: this.modelValue }));
		},
	},
});
</script>
