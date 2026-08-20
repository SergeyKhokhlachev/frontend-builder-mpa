<template>
	<div class="login__recovery">
		<h2 class="login__title">Восстановление пароля</h2>
		<template v-if="active === 'form'">
			<div class="login__describe login__text">
				Укажите адрес электронной почты. <br />Мы вышлем подробные инструкции по восстановлению пароля
			</div>
			<form class="login__form" novalidate @submit.prevent="submitHandler(false)">
				<form-input v-bind="FORM_SCHEMA.email" :ref="(el) => setFieldRef('email', el)" v-model="formData.email" />
				<button :class="['button button--primary login__button', { loading: loading }]" type="submit">
					<span>Восстановить пароль</span>
				</button>
			</form>
			<button class="button button--secondary login__button" type="button" @click="emit('shown', 'authorization')">
				<span>Войти</span>
			</button>
		</template>
		<template v-if="active === 'result'">
			<div class="login__describe login__text">
				Ссылка и указания для восстановления пароля были отправлены на указанный E-mail. Пожалуйста, следуйте инструкции по
				восстановлению, описанной в письме.
			</div>
			<button class="button button--primary login__button" type="button" @click="emit('shown', 'authorization')">
				<span>Войти</span>
			</button>
			<div class="login-timer">
				<div v-show="isTimer" class="login-timer__text">
					Отправить письмо повторно <br />можно будет через
					<span ref="timerRef" class="login-timer__count" @timerComplete="isTimer = false">00:45</span>
				</div>
				<button
					v-show="!isTimer"
					class="login-timer__link link link--dashed"
					type="button"
					:disabled="loading"
					@click="submitHandler(true)"
				>
					<span>Отправить письмо повторно</span>
				</button>
			</div>
		</template>
	</div>
</template>

<script lang="ts" setup>
import { ref, nextTick, onBeforeUnmount } from 'vue';
import { RECOVERY } from '@/api/request';
import { FormInput, useForm } from '@/components/shared/form/form.vue';
import type { FieldSchema } from '@/components/shared/form/form.types';
import type { ActiveView } from '@/components/features/login/login.types';
import Timer from '@/components/shared/timer/timer';
import type { TimerResult } from '@/components/shared/timer/timer.types';

interface FormData {
	email: string;
}

const FORM_SCHEMA: { email: FieldSchema<'input'> } = {
	email: {
		id: 'login-auth-email',
		name: 'auth-email',
		type: 'email',
		placeholder: 'Email',
		autocomplete: 'email',
		required: true,
	},
};

const emit = defineEmits<{
	shown: [value: ActiveView];
}>();

const formData = ref<FormData>({ email: '' });
const active = ref<'form' | 'result'>('form');
const loading = ref(false);
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

const { setFieldRef, checkForm } = useForm();

const submitHandler = async (repeat: boolean = false) => {
	const isValid = await checkForm(Object.keys(formData.value));

	if (!isValid) return;

	loading.value = true;

	RECOVERY(formData.value, repeat)
		.then((response) => {
			const status = response.status;

			if (status === 'success') {
				active.value = 'result';
				isTimer.value = true;
				nextTick(() => initTimer());
			}

			if (status === 'warning') {
				isTimer.value = true;
				nextTick(() => initTimer());
			}

			if (status === 'warning' || status === 'error') {
				window.app.notify?.append({
					type: response.status,
					delay: 10000,
					title: response.title,
					text: response.text,
				});
			}
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
			loading.value = false;
		});
};

onBeforeUnmount(() => {
	if (timer) {
		timer.destroy();
		timer = null;
	}
});
</script>
