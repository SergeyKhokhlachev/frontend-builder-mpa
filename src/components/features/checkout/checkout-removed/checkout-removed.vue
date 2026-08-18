<template>
	<div class="checkout-removed">
		<div class="checkout-removed__name">
			<span>Товар «</span>
			<a :href="href">{{ name }}</a>
			<span>» был удален из корзины</span>
		</div>
		<button class="checkout-removed__button" type="button" aria-label="Восстановить товар в корзине" @click="emit('recover', id)">
			<i class="icon icon-repeat" aria-hidden="true"></i>
		</button>
	</div>
</template>
<script lang="ts" setup>
withDefaults(
	defineProps<{
		id: string;
		href: string;
		name: string;
	}>(),
	{},
);

const emit = defineEmits<{
	recover: [id: string];
}>();
</script>
