<template>
	<form-element v-bind="$props" :message="messageComputed" :valid="valid" :error="error">
		<div
			:class="['form-file', { active: active }]"
			@dragover="dragoverHandler"
			@drop="dropHandler"
		>
			<input
				:id="id"
				ref="element"
				class="form-input"
				type="file"
				:name="name"
				:required="required"
				:data-look="look"
				:accept="accept"
				:multiple="multiple"
				:data-size="size"
				:data-length="length"
				@change="changeHandler"
			/>
			<div class="form-file__box">
				<div class="form-file__preview">
					<label :for="id" class="form-file__button">
						<i class="icon icon-photo"></i>
					</label>
				</div>
				<div class="form-file__vue">
					<div v-for="item in reader" :key="item.name" class="form-file__item">
						<button
							class="form-file__remove"
							type="button"
							:data-target="item.name"
							@click="removeHandler"
						>
							<i class="icon icon-close"></i>
						</button>
						<template v-if="item.img">
							<img :src="item.src" :alt="item.name" />
						</template>
						<template v-else>
							<div class="form-file__ext">
								<i class="icon icon-file"></i>
								<span>.{{ item.ext }}</span>
							</div>
						</template>
					</div>
				</div>
				<div class="form-file__content">
					<label :for="id" class="form-file__link link link--dashed">
						<span class="form-file__inform">{{ title }}</span>
					</label>
					<div class="form-file__text">{{ text }}</div>
				</div>
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
import { useGetReader } from './composition/getReader';

export default defineComponent({
	name: 'FormFile',
	components: {
		FormElement,
	},
	props: {
		id: { type: String, default: '' },
		name: { type: String, default: '' },
		label: { type: String, default: '' },
		message: { type: String, default: 'file' },
		describe: { type: String, default: '' },
		required: { type: Boolean, default: false },
		readonly: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },
		look: { type: Boolean, default: false },
		accept: { type: String, default: '.png,.jpg,.jpeg,.gif,.bmp' },
		multiple: { type: Boolean, default: false },
		size: { type: String, default: '5242880' },
		length: { type: Number, default: 5 },
		title: { type: String, default: 'Выберите фото' },
		text: {
			type: String,
			default: 'Или переместите в эту область. JPG, GIF, JPEG, PNG, BMP до 5 Мб.',
		},
	},
	emits: [],
	data() {
		return {
			value: null,
			active: false,
			valid: false,
			error: false,
			reader: [],
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
				message: options.message || this.message,
				size: this.size,
				accept: this.accept,
			};

			const result: ResultVE = useGetValid(this.value, optionsValidate);

			if (result.message) this.messageComputed = result.message;
			if (result.valid && !result.error)
				useElementComplete(this.$refs.element, { files: this.value });
			if (!optionsValidate.noRender) {
				this.valid = result.valid;
				this.error = result.error;
			}

			return result.valid;
		},

		dragoverHandler(event: DragEvent): void {
			event.preventDefault();
		},

		dropHandler(event: DragEvent): void {
			event.preventDefault();
			const dt = event.dataTransfer;
			const { files } = dt;
			if (files[0]) this.updateFile(files);
		},

		changeHandler(event: InputEvent): void {
			const $target: HTMLInputElement = event.target as HTMLInputElement;
			if ($target.files[0]) this.updateFile($target.files);
		},

		removeHandler(event: MouseEvent): void {
			const $target: HTMLElement = event.target as HTMLElement;
			const $button: HTMLElement = $target.closest('.form-file__remove');
			if ($button) {
				const target = $button.dataset.target;
				this.value = this.value.filter((file: File) => file.name !== target);
				this.reader = this.reader.filter((item: ReaderEll) => item.name !== target);
				this.$refs.element.value = '';
				useElementChange(this.$refs.element, { files: this.value });
			}
		},

		updateFile(files: FileList): void {
			const value = useGetValue(files, this.value, this.length, this.multiple);
			if (value) {
				useGetReader(value).then((result: Array<ReaderEll>) => {
					this.reader = result;
					this.value = value;
					this.active = !!this.value.length;
					useElementChange(this.$refs.element, { files: this.value });
				});
			} else {
				this.value = value;
			}
		},
	},
});
</script>
