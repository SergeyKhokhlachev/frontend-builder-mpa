<template>
	<form class="ui-kit__form" novalidate @submit.prevent="submitHandler">
		<div class="ui-kit__form-element">
			<form-input
				v-bind="FORM_SCHEMA.name"
				:ref="(el) => setFieldRef('name', el)"
				v-model="formData.name"
				@validate="fieldValidated('name', $event)"
			/>
		</div>

		<div class="ui-kit__form-element">
			<form-input
				v-bind="FORM_SCHEMA.email"
				:ref="(el) => setFieldRef('email', el)"
				v-model="formData.email"
				@validate="fieldValidated('email', $event)"
			/>
		</div>

		<div class="ui-kit__form-element">
			<form-input
				v-bind="FORM_SCHEMA.tel"
				:ref="(el) => setFieldRef('tel', el)"
				v-model="formData.tel"
				@validate="fieldValidated('tel', $event)"
			/>
		</div>

		<div class="ui-kit__form-element">
			<form-input
				v-bind="FORM_SCHEMA.password"
				:ref="(el) => setFieldRef('password', el)"
				v-model="formData.password"
				@validate="fieldValidated('password', $event)"
			/>
		</div>

		<div class="ui-kit__form-element">
			<form-select
				v-bind="FORM_SCHEMA.select"
				:ref="(el) => setFieldRef('select', el)"
				v-model="formData.select"
				@validate="fieldValidated('select', $event)"
			/>
		</div>

		<div class="ui-kit__form-element">
			<form-file
				v-bind="FORM_SCHEMA.file"
				:ref="(el) => setFieldRef('file', el)"
				@validate="fieldValidated('file', $event)"
				@change="fileChange"
			/>
		</div>

		<div class="ui-kit__form-element">
			<form-textarea
				v-bind="FORM_SCHEMA.textarea"
				:ref="(el) => setFieldRef('textarea', el)"
				v-model="formData.textarea"
				@validate="fieldValidated('textarea', $event)"
			/>
		</div>

		<div class="ui-kit__form-element">
			<form-code
				v-bind="FORM_SCHEMA.code"
				:ref="(el) => setFieldRef('code', el)"
				v-model="formData.code"
				@validate="fieldValidated('code', $event)"
			/>
		</div>

		<div class="ui-kit__form-element">
			<form-radio
				v-bind="FORM_SCHEMA.radio"
				:ref="(el) => setFieldRef('radio', el)"
				v-model="formData.radio"
				@validate="fieldValidated('radio', $event)"
			>
				<template #label="{ option }">
					<b>{{ option.label }}</b>
				</template>
			</form-radio>
		</div>

		<div class="ui-kit__form-element">
			<form-checkbox
				v-bind="FORM_SCHEMA.checkbox"
				:ref="(el) => setFieldRef('checkbox', el)"
				v-model="formData.checkbox"
				@validate="fieldValidated('checkbox', $event)"
			>
				Согласен с условиями <a href="#" class="link">политики конфиденциальности</a>
			</form-checkbox>
		</div>

		<button class="button button--primary" type="submit" :disabled="isDisabled">
			<span>Отправить</span>
		</button>
	</form>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

import {
	FormInput,
	FormTextarea,
	FormSelect,
	FormFile,
	FormRadio,
	FormCheckbox,
	FormCode,
	useForm,
} from '@/components/shared/form/form.vue';
import type { FieldSchema } from '@/components/shared/form/form.types';

import { renderDemo } from '@/components/features/uikit/uikit-render/render';

interface FormData {
	name: string;
	email: string;
	tel: string;
	password: string;
	select: string;
	file: File[];
	textarea: string;
	code: string;
	checkbox: boolean;
	radio: string;
}

type FormFields = keyof FormData;

const formData = ref<FormData>({
	name: '',
	email: 'email@gmail.com',
	tel: '+7 (232) 321-31-23',
	password: '',
	select: '',
	file: [],
	textarea: '',
	code: '',
	radio: 'courier',
	checkbox: false,
});

const FORM_SCHEMA: {
	name: FieldSchema<'input'>;
	email: FieldSchema<'input'>;
	tel: FieldSchema<'input'>;
	password: FieldSchema<'input'>;
	select: FieldSchema<'select'>;
	file: FieldSchema<'file'>;
	textarea: FieldSchema<'textarea'>;
	code: FieldSchema<'code'>;
	radio: FieldSchema<'radio'>;
	checkbox: FieldSchema<'checkbox'>;
} = {
	name: {
		id: 'ui-vue-name',
		name: 'name',
		label: 'Имя',
		placeholder: 'Введите Имя',
		autocomplete: 'given-name',
		required: true,
	},
	email: {
		id: 'ui-vue-email',
		name: 'email',
		type: 'email',
		label: 'Email',
		placeholder: 'Введите Email',
		autocomplete: 'email',
		required: true,
	},
	tel: {
		id: 'ui-vue-tel',
		name: 'tel',
		type: 'tel',
		label: 'Телефон',
		placeholder: '+7(___) ___-__-__',
		autocomplete: 'tel',
		required: true,
	},
	password: {
		id: 'ui-vue-password',
		name: 'password',
		type: 'password',
		label: 'Пароль',
		placeholder: 'Введите Пароль',
		autocomplete: 'new-password',
		required: true,
	},
	select: {
		id: 'ui-vue-select',
		name: 'select',
		label: 'Способ доставки',
		placeholder: 'Выберите из списка...',
		options: [
			{ id: 'ui-vue-select-courier', value: 'courier', label: 'Курьер' },
			{ id: 'ui-vue-select-post', value: 'post', label: 'Почта' },
			{ id: 'ui-vue-select-pickup', value: 'pickup', label: 'Самовывоз' },
			{ id: 'ui-vue-select-express', value: 'express', label: 'Экспресс' },
			{ id: 'ui-vue-select-ems', value: 'ems', label: 'EMS' },
		],
		required: true,
	},
	file: {
		id: 'ui-vue-file',
		name: 'file',
		label: 'Фото',
		multiple: true,
		required: true,
	},
	textarea: {
		id: 'ui-vue-textarea',
		name: 'textarea',
		label: 'Текст',
		placeholder: 'Введите текст',
		required: false,
	},
	code: {
		id: 'ui-vue-code',
		name: 'code',
		label: 'SMS код',
		required: true,
	},
	radio: {
		id: 'ui-vue-radio',
		name: 'radio',
		legend: 'Выберите способ доставки',
		options: [
			{ id: 'ui-vue-radio-courier', value: 'courier', label: 'Курьер' },
			{ id: 'ui-vue-radio-post', value: 'post', label: 'Почта' },
			{ id: 'ui-vue-radio-pickup', value: 'pickup', label: 'Самовывоз' },
		],
		required: false,
	},
	checkbox: {
		id: 'ui-vue-checkbox',
		name: 'checkbox',
		required: true,
	},
};

const fileChange = (files: File[]) => {
	formData.value.file = files;
};

const fieldValidCache = ref<Record<string, boolean>>({});
const fieldValidated = (fieldKey: string, isValid: boolean) => {
	fieldValidCache.value[fieldKey] = isValid;
};

const isDisabled = computed((): boolean => {
	const keys = Object.keys(FORM_SCHEMA) as FormFields[];
	return !keys.every((key) => fieldValidCache.value[key] === true);
});

const { setFieldRef, checkForm } = useForm();

const submitHandler = async () => {
	const isValid = await checkForm(Object.keys(formData.value));
	if (!isValid) return;

	const formDataObj = new FormData();
	Object.entries(formData.value).forEach(([key, value]) => {
		if (key === 'file' && Array.isArray(value)) {
			value.forEach((file) => formDataObj.append(key, file));
		} else {
			formDataObj.append(key, String(value));
		}
	});
	renderDemo(formDataObj);
};
</script>
