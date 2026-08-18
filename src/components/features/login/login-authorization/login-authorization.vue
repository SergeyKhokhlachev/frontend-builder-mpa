<template>
	<div class="login__authorization">
		<h2 class="login__title">Вход в личный кабинет</h2>
		<login-tabs v-model="activeTab" aria-label="Выбор способа авторизации" :tabs="tabs" />
		<div :id="tabs[0].panelId" role="tabpanel" :aria-labelledby="tabs[0].id" :hidden="activeTab !== 'email'">
			<form class="login__form" novalidate @submit.prevent="submitHandler('email')">
				<form-input v-bind="FORM_SCHEMA.email" :ref="(el) => setEmailRef('email', el)" v-model="formDataEmail.email" />
				<form-input v-bind="FORM_SCHEMA.password" :ref="(el) => setEmailRef('password', el)" v-model="formDataEmail.password" />
				<div class="login__box">
					<form-checkbox
						v-bind="FORM_SCHEMA.remember"
						:ref="(el) => setEmailRef('remember', el)"
						v-model="formDataEmail.remember"
					>
						Запомнить меня
					</form-checkbox>
					<button class="link link--dashed login__forgot" type="button" @click="emit('shown', 'recovery')">
						<span>Забыли пароль?</span>
					</button>
				</div>
				<button :class="['button button--primary login__button', { loading: loading.email }]" type="submit">
					<span>Войти</span>
				</button>
			</form>
			<button class="button button--secondary login__button" type="button" @click="emit('shown', 'registration')">
				<span>Зарегистрироваться</span>
			</button>
		</div>
		<div :id="tabs[0].panelId" role="tabpanel" :aria-labelledby="tabs[1].id" :hidden="activeTab !== 'tel'">
			<template v-if="active === 'form'">
				<div class="login__describe login__text">Мы вышлем вам проверочный код <br />для авторизации на сайте</div>
				<form class="login__form" novalidate @submit.prevent="submitHandler('tel')">
					<form-input v-bind="FORM_SCHEMA.tel" :ref="(el) => setTelRef('tel', el)" v-model="formDataTel.tel" />
					<button :class="['button button--primary login__button', { loading: loading.tel }]" type="submit">
						<span>Получить код</span>
					</button>
				</form>
				<button class="button button--secondary login__button" type="button" @click="emit('shown', 'registration')">
					<span>Зарегистрироваться</span>
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
import { AUTHORIZATION, SEND_CODE } from '@/api/request';
import LoginTabs from '@/components/features/login/login-tabs/login-tabs.vue';
import { FormInput, FormCheckbox, FormCode, useForm } from '@/components/shared/form/form.vue';
import type { FieldSchema } from '@/components/shared/form/form.types';
import type { ActiveView, Tab, TabItem, LoadingType, SubmitType } from '@/components/features/login/login.types';
import Timer from '@/components/shared/timer/timer';
import type { TimerResult } from '@/components/shared/timer/timer.types';

interface FormDataTel {
	tel: string;
}

interface FormDataCode {
	code: string;
}

interface FormDataEmail {
	email: string;
	password: string;
	remember: boolean;
}

const formDataTel = ref<FormDataTel>({
	tel: '',
});

const formDataCode = ref<FormDataCode>({
	code: '',
});

const formDataEmail = ref<FormDataEmail>({
	email: '',
	password: '',
	remember: false,
});

const FORM_SCHEMA: {
	email: FieldSchema<'input'>;
	password: FieldSchema<'input'>;
	tel: FieldSchema<'input'>;
	remember: FieldSchema<'checkbox'>;
	code: FieldSchema<'code'>;
} = {
	tel: {
		id: 'login-auth-tel',
		name: 'auth-tel',
		type: 'tel',
		placeholder: '+7(___) ___-__-__',
		autocomplete: 'tel',
		required: true,
	},
	code: {
		id: 'login-tel-code',
		name: 'tel-code',
		length: 6,
		required: true,
	},
	email: {
		id: 'login-auth-email',
		name: 'auth-email',
		type: 'email',
		placeholder: 'Email',
		autocomplete: 'email',
		required: true,
	},
	password: {
		id: 'login-auth-password',
		name: 'auth-password',
		type: 'password',
		placeholder: 'Пароль',
		autocomplete: 'current-password',
		required: true,
	},
	remember: {
		id: 'login-auth-remember',
		name: 'auth-remember',
		required: false,
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
		AUTHORIZATION(formData[type], type, repeat)
			.then((response) => {
				if (response.status === 'success') {
					if (type === 'email') window.app.modal?.close();
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
					window.app.modal?.close();
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
		id: 'btn-auth-email',
		panelId: 'panel-auth-email',
	},
	{
		value: 'tel',
		label: 'По телефону',
		id: 'btn-auth-tel',
		panelId: 'panel-auth-tel',
	},
];

onBeforeUnmount(() => {
	if (timer) {
		timer.destroy();
		timer = null;
	}
});
</script>
