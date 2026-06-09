<template>
	<form-element v-bind="$props" :message="messageComputed" :valid="valid" :error="error">
		<div
			ref="container"
			:class="[
				'form-select',
				{ active: active },
				{ multiple: multiple },
				{ placeholder: empty },
			]"
		>
			<select
				:id="id"
				ref="element"
				class="hidden"
				:name="name"
				:required="required"
				:data-look="look"
				:multiple="multiple"
			>
				<option value="" disabled selected>{{ placeholder }}</option>
				<option
					v-for="option in selectOptions"
					:key="option.value"
					:value="option.value"
					:selected="!!option.selected"
				>
					{{ option.text }}
				</option>
			</select>
			<div class="form-select__control" @click="toggleHandler">
				<div class="form-select__vue form-select__vue--placeholder">
					{{ placeholder }}
				</div>
				<div class="form-select__result">
					<div v-for="item in selectResult" :key="item.value" class="form-select__vue">
						<template v-if="multiple">
							<span>{{ item.text }}</span>
							<i
								class="form-select__icon-remove icon icon-close"
								:data-value="item.value"
								@click.stop="removeHandler"
							></i>
						</template>
						<template v-else>
							{{ item.text }}
						</template>
					</div>
				</div>
				<i class="form-select__icon-dropdown icon icon-chevron-down"></i>
			</div>
			<div class="form-select__dropdown">
				<div ref="scrollbar" class="form-select__scrollbar">
					<div
						v-for="option in selectOptions"
						:key="option.value"
						:data-value="option.value"
						:class="['form-select__option', { selected: option.selected }]"
						@click="selectHandler"
					>
						{{ option.text }}
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
	name: 'FormSelect',
	components: {
		FormElement,
	},
	props: {
		id: { type: String, default: '' },
		name: { type: String, default: '' },
		label: { type: String, default: '' },
		message: { type: String, default: 'select' },
		describe: { type: String, default: '' },
		placeholder: { type: String, default: '' },
		required: { type: Boolean, default: false },
		readonly: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },
		look: { type: Boolean, default: false },
		multiple: { type: Boolean, default: false },
		options: {
			type: Array<Option>,
			default: () => {
				return [{ value: '', text: '', selected: false }];
			},
		},
	},
	data() {
		return {
			value: '',
			selectOptions: this.options,
			selectResult: [],
			active: false,
			valid: false,
			error: false,
			messageComputed: this.message,
		};
	},
	computed: {
		empty() {
			return !this.selectResult.length;
		},
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

			const result: ResultVE = useGetValid(this.$refs.element, optionsValidate);

			if (result.message) this.messageComputed = result.message;
			if (result.valid && !result.error)
				useElementComplete(this.$refs.element, { value: this.value });
			if (!optionsValidate.noRender) {
				this.valid = result.valid;
				this.error = result.error;
			}

			return result.valid;
		},

		outsideHandler(event: MouseEvent): void {
			if (clickOutside(event, this.$refs.container)) this.active = false;
		},

		toggleHandler(): void {
			this.active = !this.active;
		},

		removeHandler(event: MouseEvent): void {
			const $target: HTMLElement = event.target as HTMLElement;
			const current: HTMLElement | undefined = $target.closest('[data-value]');
			const value: string | undefined = current?.getAttribute('data-value');

			this.changeSelect(value, false);
		},

		selectHandler(event: MouseEvent): void {
			const $target: HTMLElement = event.target as HTMLElement;
			const current: HTMLElement | undefined = $target.closest('[data-value]');
			const value: string | undefined = current?.getAttribute('data-value');
			const selected: boolean = current?.classList.contains('selected');

			this.changeSelect(value, !selected);

			if (!this.multiple) this.toggleHandler();
		},

		changeSelect(value: string, selected: boolean): void {
			if (!value) return;

			const current: any = Array.from(this.$refs.element.options).find(
				(option: any) => option.value === value,
			);

			current.selected = selected;
			if (selected) this.value = current.value;

			this.renderOptions();
			this.renderResult();
			useElementChange(this.$refs.element, { value: this.value });
		},

		renderOptions(): void {
			this.selectOptions = Array.from(this.$refs.element.options).filter(
				(option: Option) => option.value,
			);
		},

		renderResult(): void {
			this.selectResult = Array.from(this.$refs.element.options).filter(
				(option: Option) => option.selected && option.value,
			);
		},
	},
});
</script>
