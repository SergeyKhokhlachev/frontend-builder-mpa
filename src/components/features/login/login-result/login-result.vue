<template>
	<div class="login__result">
		<h2 class="login__title">Вы успешно зарегестрированы</h2>
		<picture>
			<img class="login__image" src="/images/success.svg" alt="" aria-hidden="true" width="104" height="104" />
		</picture>
		<a class="button button--secondary login__button" href="#">
			<span>Перейти в профиль</span>
		</a>
		<button class="link link--dashed login__close" type="button" @click="closeHandler"><span>Закрыть</span></button>
	</div>
</template>

<script lang="ts" setup>
const closeHandler = () => {
	window.app.modal?.close();
};
</script>
