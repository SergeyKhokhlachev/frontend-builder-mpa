<template>
	<form-element
		:for-id="id"
		:error-id="`${id}-error`"
		:label="label"
		:describe="describe"
		:required="required"
		:disabled="disabled"
		:message="viewResult.message"
		:valid="viewResult.valid"
		:error="viewResult.error"
	>
		<div
			:class="['form-file', { active: active }]"
			tabindex="0"
			role="button"
			aria-label="Загрузить файлы"
			@drop.prevent="dropHandler"
			@dragover.prevent
			@dragenter.prevent
		>
			<input
				:id="id"
				ref="fileInput"
				class="form-input"
				type="file"
				:name="name"
				:required="required"
				:accept="accept"
				:multiple="multiple"
				:aria-describedby="`${id}-error`"
				:aria-invalid="!viewResult.valid"
				:aria-required="required"
				@change="changeHandler"
			/>
			<div class="form-file__box">
				<div class="form-file__preview">
					<label :for="id" class="form-file__button">
						<i class="icon icon-camera" aria-hidden="true"></i>
					</label>
				</div>
				<div class="form-file__vue" role="list">
					<div v-for="item in viewFiles" :key="item.id" class="form-file__item" role="listitem">
						<button
							class="form-file__remove"
							type="button"
							:aria-label="`Удалить файл ${item.name}`"
							@click="removeFile(item.name)"
						>
							<i class="icon icon-close" aria-hidden="true"></i>
						</button>
						<template v-if="item.img && typeof item.src === 'string'">
							<img :src="item.src" :alt="item.name" />
						</template>
						<template v-else>
							<div class="form-file__ext">
								<i class="icon icon-file" aria-hidden="true" :title="`Файл ${item.name}`" :aria-label="`Файл ${item.name}`"></i>
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

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import FormElement from '@/components/shared/form/form-element/form-element.vue';
import { getValidateFiles, getUpdateFiles, getViewFiles } from '@/components/shared/form/common/validate';
import type { ResultValidate, ViewFileOptions } from '@/components/shared/form/form.types';

const props = withDefaults(
	defineProps<{
		id: string;
		name: string;
		label?: string;
		describe?: string;
		title?: string;
		text?: string;
		size?: number;
		length?: number;
		accept?: string;
		multiple?: boolean;
		required?: boolean;
		disabled?: boolean;
	}>(),
	{
		title: 'Выберите фото',
		text: 'или переместите в эту область.',
		size: 5242880, // 5MB
		length: 5,
		accept: '.png,.jpg,.jpeg,.gif,.bmp,.txt',
		required: false,
		disabled: false,
		multiple: false,
	},
);

const emit = defineEmits<{
	validate: [value: boolean];
	change: [value: File[]];
}>();

const message = 'file';

const viewResult = ref<ResultValidate>({ valid: false, error: false, message: '' });
const viewFiles = ref<ViewFileOptions[]>([]);
const files = ref<File[]>([]);
const active = ref(false);

const validate = (draw: boolean = true, empty: boolean = false): boolean => {
	const result = getValidateFiles(message, files.value, empty, props.required, props.accept, props.size);

	if (draw) viewResult.value = result;

	emit('validate', result.valid);
	return result.valid;
};

const appenFiles = (upload: FileList) => {
	const updated = getUpdateFiles(upload, files.value, props.length, props.multiple);

	getViewFiles(updated).then((result) => {
		viewFiles.value = result;
		files.value = updated;
		active.value = !!updated.length;
		validate(true, false);
		emit('change', files.value);
	});
};

const removeFile = (name: string) => {
	files.value = files.value.filter((file) => file.name !== name);
	viewFiles.value = viewFiles.value.filter((item) => item.name !== name);
	active.value = !!files.value.length;
	validate(true, true);
	emit('change', files.value);
};

const changeHandler = (event: Event) => {
	const target = event.target as HTMLInputElement;
	if (target.files?.length) appenFiles(target.files);
};

const dropHandler = (event: DragEvent) => {
	if (props.disabled) return;
	const dt = event.dataTransfer;
	if (dt?.files.length) appenFiles(dt.files);
};

onMounted(() => {
	validate(false);
});

defineExpose({
	validate,
});
</script>
