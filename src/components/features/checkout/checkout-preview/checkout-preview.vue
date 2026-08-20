<template>
	<div ref="checkoutPreviewRef" class="checkout-preview">
		<div :class="['checkout-preview__loader', { loading: isLoading }]"></div>
		<div v-if="productsAvailable.length" class="checkout-preview__header">
			<p class="checkout-preview__title">Ваша корзина</p>
			<button class="link link--dashed" type="button" aria-label="Очистить корзину" @click.stop="clearHandler">
				<span>Очистить</span>
			</button>
		</div>
		<div v-if="!productsAvailable.length" class="checkout-preview__header">
			<p class="checkout-preview__title">Ваша корзина пуста</p>
		</div>
		<div v-if="productsAvailable.length" class="checkout-preview__body">
			<checkout-card-short
				v-for="product in productsAvailable"
				:key="product.id"
				v-bind="product"
				@change="changeHandler"
				@remove="removeHandler"
			/>
		</div>
		<div class="checkout-preview__footer">
			<a v-if="productsAvailable.length" class="button button--primary" href="/pages/checkout.html" @click="closeHandler"
				>Перейти в корзину</a
			>
			<a v-if="!productsAvailable.length" class="button button--primary" href="/pages/catalog.html" @click="closeHandler"
				>Перейти в каталог</a
			>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';

import CheckoutCardShort from '@/components/features/checkout/checkout-card-short/checkout-card-short.vue';
import type { Product } from '@/components/features/checkout/checkout.types';

import { GET_CART } from '@/api/request';

const isLoading = ref(false);

const products = ref<Product[]>([]);
const productsAvailable = computed(() => products.value.filter((product) => product.available));

const checkoutPreviewRef = ref<HTMLButtonElement | null>(null);
const dropdown = ref<HTMLButtonElement | null>(null);

const clearHandler = () => {
	products.value = [];
};

const changeHandler = (id: string, value: number) => {
	const product = products.value.find((p) => p.id === id);
	if (product) product.added = value;
};

const removeHandler = (id: string) => {
	const targetIndex = products.value.findIndex((p) => p.id === id);
	if (targetIndex === -1) return;
	products.value.splice(targetIndex, 1);
};

const closeHandler = () => {
	const dropdownInst = window.app.classInstance.get(dropdown.value);
	if (dropdownInst) dropdownInst.dropdown.close();
};

// Loading Cart products
onMounted(() => {
	isLoading.value = true;
	GET_CART()
		.then((response: Product[]) => {
			products.value = response;
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
			isLoading.value = false;
		});

	if (checkoutPreviewRef.value) dropdown.value = checkoutPreviewRef.value.closest('.js-dropdown');
});
</script>
