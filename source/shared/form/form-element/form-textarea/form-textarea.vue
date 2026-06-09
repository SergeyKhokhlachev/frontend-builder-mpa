<template>
	<form-element v-bind="$props" :message="messageComputed" :valid="valid" :error="error">
		<textarea
			:id="id"
			ref="element"
			class="form-textarea"
			:name="name"
			:value="modelValue"
			:placeholder="placeholder"
			:autocomplete="autocomplete"
			:required="required"
			:data-rule="rule"
			:data-look="look"
			@input="changeHandler"
			@change="changeHandler"
		/>
	</form-element>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { classInstance } from '@/shared/helpers/helpers';

import FormElement from '../form-element.vue';

import { useElementChange, useElementComplete } from '../composition/elementEvents';
import { useGetValid } from './composition/getValid';

export default defineComponent({
	name: 'FormTextarea',
	components: {
		FormElement,
	},
	props: {
		id: { type: String, default: '' },
		name: { type: String, default: '' },
		modelValue: { type: String, default: '' },
		label: { type: String, default: '' },
		message: { type: String, default: 'textarea' },
		describe: { type: String, default: '' },
		placeholder: { type: String, default: '' },
		autocomplete: { type: String, default: 'off' },
		required: { type: Boolean, default: false },
		readonly: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },
		look: { type: Boolean, default: false },
		rule: { type: String, default: 'text' },
	},
	emits: ['update:modelValue'],
	data() {
		return {
			valid: false,
			error: false,
			messageComputed: this.message,
		};
	},
	mounted() {
		classInstance.set(this.$refs.element, { formElement: this });
	},
	beforeUnmount() {
		classInstance.del(this.$refs.element, 'formElement');
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
