<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<div class="login">
		<login-authorization v-if="active === 'authorization'" @shown="toggleHandler" />
		<login-registration v-if="active === 'registration'" @shown="toggleHandler" />
		<login-recovery v-if="active === 'recovery'" @shown="toggleHandler" />
		<login-result v-if="active === 'result'" />
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import LoginAuthorization from '@/components/features/login/login-authorization/login-authorization.vue';
import LoginRegistration from '@/components/features/login/login-registration/login-registration.vue';
import LoginRecovery from '@/components/features/login/login-recovery/login-recovery.vue';
import LoginResult from '@/components/features/login/login-result/login-result.vue';
import type { ActiveView } from '@/components/features/login/login.types';

const active = ref<ActiveView>('authorization');
const modalLogin = document.querySelector('#modal-login');

const toggleHandler = (value: ActiveView) => {
	active.value = value;
};

const modalCloseHandler = () => {
	setTimeout(() => {
		active.value = 'authorization';
	}, 500);
};

onMounted(() => {
	modalLogin?.addEventListener('modalClose', modalCloseHandler);
});

onBeforeUnmount(() => {
	modalLogin?.removeEventListener('modalClose', modalCloseHandler);
});
</script>
