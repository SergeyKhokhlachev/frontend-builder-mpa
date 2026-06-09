<template>
	<div
		:class="[
			'form-checkbox',
			{ valid: valid },
			{ error: error },
			{ required: required },
			{ readonly: readonly },
			{ disabled: disabled },
		]"
	>
		<div class="form-checkbox__control">
			<input
				:id="id"
				ref="element"
				class="form-checkbox__input"
				type="checkbox"
				:name="name"
				:value="modelValue"
				:required="required"
				:data-look="look"
				@change="changeHandler"
			/>
			<div class="form-checkbox__vue">
				<i class="icon icon-check"></i>
			</div>
		</div>
		<label class="form-checkbox__label" :for="id" v-html="label"></label>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { classInstance } from '@/shared/helpers/helpers';

import { useElementChange, useElementComplete } from '../composition/elementEvents';
import { useGetValid } from './composition/getValid';

export default defineComponent({
	name: 'FormCheckbox',
	props: {
		id: { type: String, default: '' },
		name: { type: String, default: '' },
		modelValue: { type: Boolean, default: false },
		label: { type: String, default: '' },
		required: { type: Boolean, default: false },
		readonly: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },
		look: { type: Boolean, default: false },
	},
	emits: ['update:modelValue'],
	data() {
		return {
			valid: false,
			error: false,
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
			};

			const result: ResultVE = useGetValid(this.$refs.element, optionsValidate);

			if (result.valid && !result.error)
				useElementComplete(this.$refs.element, { checked: this.modelValue });
			if (!optionsValidate.noRender) {
				this.valid = result.valid;
				this.error = result.error;
			}

			return result.valid;
		},

		changeHandler(event: InputEvent): void {
			const $target: HTMLInputElement = event.target as HTMLInputElement;
			this.$emit('update:modelValue', $target.checked);
			setTimeout(() => useElementChange(this.$refs.element, { checked: this.modelValue }));
		},
	},
});
</script>
