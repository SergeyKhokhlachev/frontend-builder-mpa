<template>
	<form-element v-bind="$props" :message="messageComputed" :valid="valid" :error="error">
		<div class="form-code">
			<input
				:id="id"
				ref="element"
				class="hidden"
				type="text"
				:name="name"
				:value="modelValue"
				:required="required"
				:data-look="look"
				tabindex="-1"
			/>
			<div ref="codeElements" class="form-code__vue">
				<input
					class="form-input"
					type="text"
					maxlength="1"
					@paste="pasteHandler"
					@keydown="keydownHandler"
					@input="changeHandler"
					@change="changeHandler"
				/>
				<input
					class="form-input"
					type="text"
					maxlength="1"
					@paste="pasteHandler"
					@keydown="keydownHandler"
					@input="changeHandler"
					@change="changeHandler"
				/>
				<input
					class="form-input"
					type="text"
					maxlength="1"
					@paste="pasteHandler"
					@keydown="keydownHandler"
					@input="changeHandler"
					@change="changeHandler"
				/>
				<input
					class="form-input"
					type="text"
					maxlength="1"
					@paste="pasteHandler"
					@keydown="keydownHandler"
					@input="changeHandler"
					@change="changeHandler"
				/>
				<input
					class="form-input"
					type="text"
					maxlength="1"
					@paste="pasteHandler"
					@keydown="keydownHandler"
					@input="changeHandler"
					@change="changeHandler"
				/>
			</div>
		</div>
	</form-element>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { classInstance } from '@/shared/helpers/helpers';

import FormElement from '../form-element.vue';

import { useElementChange, useElementComplete } from '../composition/elementEvents';
import { useGetValid } from './composition/getValid';
import { useGetValue } from './composition/getValue';
import { useGetCode } from './composition/getCode';
import { useCheckDigit } from './composition/checkDigit';
import { useSetTarget } from './composition/setTarget';

export default defineComponent({
	name: 'FormCode',
	components: {
		FormElement,
	},
	props: {
		id: { type: String, default: '' },
		name: { type: String, default: '' },
		modelValue: { type: String, default: '' },
		label: { type: String, default: '' },
		message: { type: String, default: 'code' },
		describe: { type: String, default: '' },
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
			messageComputed: this.message,
		};
	},
	computed: {
		$codeElements() {
			return this.$refs.codeElements.querySelectorAll('.form-input');
		},
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
				message: options.message || this.message,
			};

			const result: ResultVE = useGetValid(
				this.$refs.element,
				this.$codeElements.length,
				optionsValidate,
			);

			if (result.message) this.messageComputed = result.message;
			if (result.valid && !result.error)
				useElementComplete(this.$refs.element, { value: this.modelValue });
			if (!optionsValidate.noRender) {
				this.valid = result.valid;
				this.error = result.error;
			}

			return result.valid;
		},

		keydownHandler(event: KeyboardEvent): void {
			const $target: HTMLInputElement = event.target as HTMLInputElement;
			const code = useGetCode(event);

			switch (code) {
				case 'Space':
					useSetTarget(Array.from(this.$codeElements), $target, 1);
					break;

				case 'Backspace':
					if ($target.value) {
						$target.value = '';
						this.updateValue();
					} else {
						useSetTarget(Array.from(this.$codeElements), $target, -1);
					}
					break;

				case 'ArrowRight':
					useSetTarget(Array.from(this.$codeElements), $target, 1);
					break;

				case 'ArrowLeft':
					useSetTarget(Array.from(this.$codeElements), $target, -1);
					break;

				case 'Digit':
					$target.value = event.key;
					this.updateValue();
					useSetTarget(Array.from(this.$codeElements), $target, 1);
					break;

				default:
					break;
			}
		},

		pasteHandler(event: ClipboardEvent): void {
			event.preventDefault();
			this.updateVue(event.clipboardData.getData('text'));
			this.updateValue();
		},

		changeHandler(event: InputEvent): void {
			const $target: HTMLInputElement = event.target as HTMLInputElement;
			if (useCheckDigit($target.value)) {
				this.updateValue();
			} else {
				$target.value = '';
			}
		},

		updateValue(): void {
			this.$emit('update:modelValue', useGetValue(this.$codeElements));
			setTimeout(() => useElementChange(this.$refs.element, { value: this.modelValue }));
		},

		updateVue(value: string): void {
			this.$codeElements.forEach((element: HTMLInputElement, index: number) => {
				if (value[index]) {
					if (useCheckDigit(value[index])) element.value = value[index];
					element.focus();
				}
			});
		},
	},
});
</script>
