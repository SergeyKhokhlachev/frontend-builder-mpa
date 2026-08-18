<template>
	<div class="login__registration">
		<h2 class="login__title">Регистрация</h2>
		<login-tabs v-model="activeTab" aria-label="Выбор способа регистрации" :tabs="tabs" />
		<div :id="tabs[0].panelId" role="tabpanel" :aria-labelledby="tabs[0].id" :hidden="activeTab !== 'email'">
			<form class="login__form" novalidate @submit.prevent="submitHandler('email')">
				<form-input v-bind="FORM_SCHEMA.name" :ref="(el) => setEmailRef('name', el)" v-model="formDataEmail.name" />
				<form-input v-bind="FORM_SCHEMA.email" :ref="(el) => setEmailRef('email', el)" v-model="formDataEmail.email" />
				<form-input v-bind="FORM_SCHEMA.password" :ref="(el) => setEmailRef('password', el)" v-model="formDataEmail.password" />
				<div class="login__confirm">
					<form-checkbox v-bind="FORM_SCHEMA.confirm" :ref="(el) => setEmailRef('confirm', el)" v-model="formDataEmail.confirm">
						Продолжая, вы соглашаетесь с <br />
						<a href="#" class="link" target="_blank">политикой конфиденциальности</a>
					</form-checkbox>
				</div>
				<button :class="['button button--primary login__button', { loading: loading.email }]" type="submit">
					<span>Зарегистрироваться</span>
				</button>
			</form>
			<button class="button button--secondary login__button" type="button" @click="emit('shown', 'authorization')">
				<span>Войти</span>
			</button>
		</div>
		<div :id="tabs[1].panelId" role="tabpanel" :aria-labelledby="tabs[1].id" :hidden="activeTab !== 'tel'">
			<template v-if="active === 'form'">
				<form class="login__form" novalidate @submit.prevent="submitHandler('tel')">
					<form-input v-bind="FORM_SCHEMA.name" :ref="(el) => setTelRef('name', el)" v-model="formDataTel.name" />
					<form-input v-bind="FORM_SCHEMA.tel" :ref="(el) => setTelRef('tel', el)" v-model="formDataTel.tel" />
					<div class="login__confirm">
						<form-checkbox v-bind="FORM_SCHEMA.confirm" :ref="(el) => setTelRef('confirm', el)" v-model="formDataTel.confirm">
							Продолжая, вы соглашаетесь с <br />
							<a href="#" class="link" target="_blank">политикой конфиденциальности</a>
						</form-checkbox>
					</div>
					<button :class="['button button--primary login__button', { loading: loading.tel }]" type="submit">
						<span>Подтвердить номер телефона</span>
					</button>
				</form>
				<button class="button button--secondary login__button" type="button" @click="emit('shown', 'authorization')">
					<span>Войти</span>
				</button>
			</template>
			<template v-if="active === 'code'">
				<div class="login__describe login__describe--code login__text">
					Код выслан на номер <b>{{ formDataTel.tel }}</b>
				</div>
				<form class="login__code" novalidate @submit.prevent="submitHandler('code')">
					<form-code v-bind="FORM_SCHEMA.code" :ref="(el) => setCodeRef('code', el)" v-model="formDataCode.code" />
					<div class="login-timer">
						<div v-show="isTimer" class="login-timer__text">
							Отправить код повторно <br />можно будет через
							<span ref="timerRef" class="login-timer__count" @timerComplete="isTimer = false">00:45</span>
						</div>
						<button
							v-show="!isTimer"
							class="login-timer__link link link--dashed"
							type="button"
							:disabled="loading.timer"
							@click="submitHandler('tel', true)"
						>
							<span>Отправить код повторно</span>
						</button>
					</div>
					<button :class="['button button--primary login__button', { loading: loading.code }]" type="submit">
						<span>Войти</span>
					</button>
				</form>
				<button class="button button--secondary login__button" type="button" @click="active = 'form'">
					<span>Назад</span>
				</button>
			</template>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, nextTick, onBeforeUnmount } from 'vue';
import { REGISTRATION, SEND_CODE } from '@/api/request';
import LoginTabs from '@/components/features/login/login-tabs/login-tabs.vue';
import { FormInput, FormCheckbox, FormCode, useForm } from '@/components/shared/form/form.vue';
import type { FieldSchema } from '@/components/shared/form/form.types';
import type { ActiveView, Tab, TabItem, LoadingType, SubmitType } from '@/components/features/login/login.types';
import Timer from '@/components/shared/timer/timer';
import type { TimerResult } from '@/components/shared/timer/timer.types';

interface FormDataTel {
	name: string;
	tel: string;
	confirm: boolean;
}

interface FormDataCode {
	code: string;
}

interface FormDataEmail {
	name: string;
	email: string;
	password: string;
	confirm: boolean;
}

const formDataCode = ref<FormDataCode>({
	code: '',
});

const formDataTel = ref<FormDataTel>({
	name: '',
	tel: '',
	confirm: false,
});

const formDataEmail = ref<FormDataEmail>({
	name: '',
	email: '',
	password: '',
	confirm: false,
});

const FORM_SCHEMA: {
	name: FieldSchema<'input'>;
	email: FieldSchema<'input'>;
	password: FieldSchema<'input'>;
	tel: FieldSchema<'input'>;
	confirm: FieldSchema<'checkbox'>;
	code: FieldSchema<'code'>;
} = {
	code: {
		id: 'login-tel-code',
		name: 'tel-code',
		length: 6,
		required: true,
	},
	tel: {
		id: 'login-reg-tel',
		name: 'reg-tel',
		type: 'tel',
		placeholder: '+7(___) ___-__-__',
		autocomplete: 'tel',
		required: true,
	},
	name: {
		id: 'login-reg-name',
		name: 'reg-name',
		placeholder: 'Имя',
		autocomplete: 'given-name',
		required: true,
	},
	email: {
		id: 'login-reg-email',
		name: 'reg-email',
		type: 'email',
		placeholder: 'Email',
		autocomplete: 'email',
		required: true,
	},
	password: {
		id: 'login-reg-password',
		name: 'reg-password',
		type: 'password',
		placeholder: 'Пароль',
		autocomplete: 'current-password',
		required: true,
	},
	confirm: {
		id: 'login-reg-confirm',
		name: 'reg-rememder',
		required: true,
	},
};

const emit = defineEmits<{
	shown: [value: ActiveView];
}>();

const active = ref<'form' | 'code'>('form');
const loading = ref<LoadingType>({ tel: false, email: false, code: false, timer: false });

const { setFieldRef: setCodeRef, checkForm: checkCode } = useForm();
const { setFieldRef: setTelRef, checkForm: checkTel } = useForm();
const { setFieldRef: setEmailRef, checkForm: checkEmail } = useForm();

const checkForm = {
	tel: checkTel,
	code: checkCode,
	email: checkEmail,
};

const submitHandler = async (type: SubmitType, repeat: boolean = false) => {
	const formData = {
		tel: formDataTel.value,
		code: formDataCode.value,
		email: formDataEmail.value,
	};

	const isValid = await checkForm[type](Object.keys(formData[type]));

	if (!isValid) return;

	loading.value[type] = true;

	if (type === 'email' || type === 'tel') {
		REGISTRATION(formData[type], type, repeat)
			.then((response) => {
				if (response.status === 'success') {
					if (type === 'email') emit('shown', 'result');
					if (type === 'tel') {
						active.value = 'code';
						nextTick(() => initTimer());
					}
					return;
				}

				window.app.notify?.append({
					type: response.status,
					delay: 10000,
					title: response.title,
					text: response.text,
				});
			})
			.catch((error) => {
				window.app.notify?.append({
					type: 'error',
					delay: 10000,
					title: 'Ошибка',
					text: error instanceof Error ? error.message : String(error),
				});
			})
			.finally(() => {
				loading.value[type] = false;
			});
	} else {
		SEND_CODE(formData[type])
			.then((response) => {
				if (response.status === 'success') {
					emit('shown', 'result');
					return;
				}

				window.app.notify?.append({
					type: response.status,
					delay: 10000,
					title: response.title,
					text: response.text,
				});
			})
			.catch((error) => {
				window.app.notify?.append({
					type: 'error',
					delay: 10000,
					title: 'Ошибка',
					text: error instanceof Error ? error.message : String(error),
				});
			})
			.finally(() => {
				loading.value[type] = false;
			});
	}
};

const isTimer = ref(true);
const timerRef = ref<HTMLElement | null>(null);
let timer: Timer | null = null;

const initTimer = () => {
	if (!timerRef.value) return;
	if (!timer) {
		timer = new Timer(timerRef.value, {
			count: '45',
			type: 'number',
			format: (data: TimerResult) => `00:${data.seconds?.value || '00'}`,
		});
	}
	timer.reset();
	timer.start();
};

const activeTab = ref<Tab>('email');
const tabs: TabItem[] = [
	{
		value: 'email',
		label: 'По эл. почте',
		id: 'btn-reg-email',
		panelId: 'panel-reg-email',
	},
	{
		value: 'tel',
		label: 'По телефону',
		id: 'btn-reg-tel',
		panelId: 'panel-reg-tel',
	},
];

onBeforeUnmount(() => {
	if (timer) {
		timer.destroy();
		timer = null;
	}
});
</script>
