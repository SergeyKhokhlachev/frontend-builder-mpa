<template>
	<form-element v-bind="$props" :message="messageComputed" :valid="valid" :error="error">
		<div ref="container" :class="['form-complete', { active: active }]">
			<div class="form-complete__control">
				<input
					:id="id"
					ref="element"
					class="form-input"
					type="text"
					:name="name"
					:value="modelValue"
					:placeholder="placeholder"
					:autocomplete="autocomplete"
					:required="required"
					:data-look="look"
					@input="changeHandler"
					@click="openHandler"
				/>
			</div>
			<div class="form-complete__dropdown">
				<div ref="scrollbar" class="form-complete__scrollbar">
					<div class="form-complete__options">
						<div
							v-for="item in options"
							:key="item.value"
							:data-value="item.value"
							:class="['form-complete__option', { selected: modelValue === item.value }]"
							@click="selectHandler"
						>
							{{ item.text }}
						</div>
						<div v-show="!options.length" class="form-complete__empty">{{ empty }}</div>
					</div>
				</div>
			</div>
		</div>
	</form-element>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { classInstance, clickOutside } from '@/shared/helpers/helpers';
import { Scrollbar } from '@/shared/common/scrollbar/scrollbar';

import FormElement from '../form-element.vue';

import { useElementChange, useElementComplete } from '../composition/elementEvents';
import { useGetValid } from './composition/getValid';

export default defineComponent({
	name: 'FormComplete',
	components: {
		FormElement,
	},
	props: {
		id: { type: String, default: '' },
		name: { type: String, default: '' },
		modelValue: { type: String, default: '' },
		label: { type: String, default: '' },
		message: { type: String, default: 'complete' },
		describe: { type: String, default: '' },
		placeholder: { type: String, default: '' },
		autocomplete: { type: String, default: '' },
		required: { type: Boolean, default: false },
		readonly: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },
		look: { type: Boolean, default: false },
		empty: { type: String, default: 'Нет данных ...' },
		options: {
			type: Array<Option>,
			default: () => {
				return [{ value: '', text: '', complete: false }];
			},
		},
	},
	emits: ['update:modelValue', 'change', 'complete'],
	data() {
		return {
			active: false,
			valid: false,
			error: false,
			complite: false,
			messageComputed: '',
		};
	},
	mounted() {
		classInstance.set(this.$refs.element, { formElement: this });
		this.scrollbar = new Scrollbar(this.$refs.scrollbar);
		document.addEventListener('click', this.outsideHandler);
	},
	beforeUnmount() {
		classInstance.del(this.$refs.element, 'formElement');
		this.scrollbar.destroy();
		document.removeEventListener('click', this.outsideHandler);
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
				this.complite,
				this.selected(this.modelValue),
				optionsValidate,
			);

			if (result.message) this.messageComputed = result.message;
			if (result.valid && !result.error) {
				this.complite = true;
				this.$emit('complete', {
					value: this.modelValue,
					selected: this.selected(this.modelValue),
				});
				useElementComplete(this.$refs.element, {
					value: this.modelValue,
					selected: this.selected(this.modelValue),
				});
			}
			if (!optionsValidate.noRender) {
				this.valid = result.valid;
				this.error = result.error;
			}

			return result.valid;
		},

		outsideHandler(event: MouseEvent): void {
			if (clickOutside(event, this.$refs.container)) this.active = false;
		},

		openHandler(): void {
			this.active = true;
		},

		changeHandler(event: InputEvent): void {
			const $target: HTMLInputElement = event.target as HTMLInputElement;

			this.complite = false;
			this.$emit('update:modelValue', $target.value);

			setTimeout(() => {
				this.$emit('change', {
					value: this.modelValue,
					selected: this.selected(this.modelValue),
				});
				useElementChange(this.$refs.element, {
					value: this.modelValue,
					selected: this.selected(this.modelValue),
				});
			});
		},

		selectHandler(event: MouseEvent): void {
			const $target: HTMLElement = event.target as HTMLElement;
			const current: HTMLElement | undefined = $target.closest('[data-value]');
			const value: string | undefined = current?.getAttribute('data-value');

			this.active = false;
			this.complite = false;
			this.$emit('update:modelValue', value);

			setTimeout(() => {
				this.$emit('change', {
					value: this.modelValue,
					selected: this.selected(this.modelValue),
				});
				useElementChange(this.$refs.element, {
					value: this.modelValue,
					selected: this.selected(this.modelValue),
				});
			});
		},

		selected(value: string): Option | undefined {
			return this.options.find((option: Option) => value === option.value);
		},
	},
});
</script>
