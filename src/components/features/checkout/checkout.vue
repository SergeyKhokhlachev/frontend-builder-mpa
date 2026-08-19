<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<div class="checkout">
		<template v-if="products.length || productsRemoved.length">
			<div class="checkout__main">
				<div class="checkout__header">
					<div class="heckout__tablist" role="tablist" @keydown="keydownHandler">
						<button
							id="btn-product-available"
							ref="tabAvailableRef"
							:class="['checkout__button', { active: tabActive === 'available' && productsAvailable.length }]"
							type="button"
							role="tab"
							:aria-selected="tabActive === 'available'"
							aria-controls="panel-product-available"
							:tabindex="tabActive === 'available' ? 0 : -1"
							:disabled="!productsAvailable.length"
							@click="clickHandler('available')"
						>
							<span>Готовые к заказу</span>
							<span v-if="productsAvailable.length">({{ productsAvailable.length }})</span>
						</button>
						<button
							id="btn-product-unavailable"
							ref="tabUnavailableRef"
							:class="['checkout__button', { active: tabActive === 'unavailable' && productsUnavailable.length }]"
							type="button"
							role="tab"
							:aria-selected="tabActive === 'unavailable'"
							aria-controls="panel-product-unavailable"
							:tabindex="tabActive === 'unavailable' ? 0 : -1"
							:disabled="!productsUnavailable.length"
							@click="clickHandler('unavailable')"
						>
							<span>Недоступные</span>
							<span v-if="productsUnavailable.length">({{ productsUnavailable.length }})</span>
						</button>
					</div>
					<button
						class="checkout__clear"
						type="button"
						aria-label="Очистить корзину"
						:disabled="!products.length && !productsRemoved.length"
						@click="clearHandler"
					>
						<span>Очистить корзину</span>
						<i class="icon icon-trash"></i>
					</button>
				</div>
				<div class="checkout__body">
					<div :class="['checkout__loader', { active: isLoading }]"></div>
					<div
						v-show="tabActive === 'available'"
						id="panel-product-available"
						class="checkout__body"
						role="tabpanel"
						aria-labelledby="btn-product-available"
					>
						<checkout-card
							v-for="product in productsAvailable"
							:key="product.id"
							v-bind="product"
							@change="changeHandler"
							@remove="removeHandler"
						/>
					</div>
					<div
						v-show="tabActive === 'unavailable'"
						id="panel-product-unavailable"
						class="checkout__body"
						role="tabpanel"
						aria-labelledby="btn-product-unavailable"
					>
						<checkout-card v-for="product in productsUnavailable" :key="product.id" v-bind="product" />
					</div>
				</div>
				<div v-if="productsRemoved.length" class="checkout__footer">
					<checkout-removed
						v-for="product in productsRemoved"
						:id="product.id"
						:key="product.id"
						:name="product.name"
						:href="product.href"
						@recover="recoverHandler"
					/>
				</div>
				<div v-if="isCheckout" ref="formRef" class="checkout__order">
					<checkout-form @submit="submitHandler" @delivery="deliveryHandler" />
				</div>
			</div>
			<div class="checkout__aside">
				<checkout-panel
					:products="productsAvailable"
					:delivery="deliveryPrice"
					:loading="isLoadingPanel"
					@checkout="checkoutHandler"
				/>
			</div>
		</template>
		<template v-else>
			<div :class="['checkout__empty', { hidden: isHidden }]">
				<i class="icon icon-cart"></i>
				<p class="checkout__title">Ваша корзина пуста</p>
				<p class="checkout__text">
					<a class="link" href="/pages/catalog.html"> <span>Нажмите здесь</span> </a>, чтобы продолжить покупки
				</p>
			</div>
		</template>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import CheckoutPanel from '@/components/features/checkout/checkout-panel/checkout-panel.vue';
import CheckoutCard from '@/components/features/checkout/checkout-card/checkout-card.vue';
import CheckoutRemoved from '@/components/features/checkout/checkout-removed/checkout-removed.vue';
import CheckoutForm from '@/components/features/checkout/checkout-form/checkout-form.vue';
import type { Tab, Product, FormData } from '@/components/features/checkout/checkout.types';

import { GET_CART, SEND_ORDER } from '@/api/request';

const formRef = ref<HTMLElement | null>(null);

const tabActive = ref<Tab>('available');
const isLoading = ref(false);
const isLoadingPanel = ref(false);
const isHidden = ref(true);
const isCheckout = ref(false);

const products = ref<Product[]>([]);
const productsRemoved = ref<Product[]>([]);
const productsAvailable = computed(() => products.value.filter((product) => product.available));
const productsUnavailable = computed(() => products.value.filter((product) => !product.available));

const deliveryPrice = ref(0);

const changeHandler = (id: string, value: number) => {
	const product = products.value.find((p) => p.id === id);
	if (product) product.added = value;
};

const removeHandler = (id: string) => {
	const targetIndex = products.value.findIndex((p) => p.id === id);
	if (targetIndex === -1) return;

	const targetProduct = products.value[targetIndex];
	productsRemoved.value.push(targetProduct);
	products.value.splice(targetIndex, 1);
};

const recoverHandler = (id: string) => {
	const removedIndex = productsRemoved.value.findIndex((p) => p.id === id);
	if (removedIndex === -1) return;

	const recoveredProduct = productsRemoved.value[removedIndex];
	products.value.push(recoveredProduct);
	productsRemoved.value.splice(removedIndex, 1);
};

const clearHandler = () => {
	products.value = [];
	productsRemoved.value = [];
	isHidden.value = false;
};

const checkoutHandler = () => {
	isCheckout.value = true;
	nextTick(() => {
		if (formRef.value) formRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
	});
};

const deliveryHandler = (price: number) => {
	deliveryPrice.value = price;
};

const submitHandler = (data: FormData) => {
	isLoadingPanel.value = true;
	SEND_ORDER(data)
		.then(() => {
			const url = new URL('/pages/checkout-result.html', location.origin);
			window.location.href = url.href;
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
			isLoadingPanel.value = false;
		});
};

// Tabs
const tabAvailableRef = ref<HTMLButtonElement | null>(null);
const tabUnavailableRef = ref<HTMLButtonElement | null>(null);

const tabsConfig = computed(() => [
	{ id: 'available' as Tab, disabled: !productsAvailable.value.length || isLoading.value, ref: tabAvailableRef },
	{ id: 'unavailable' as Tab, disabled: !productsUnavailable.value.length || isLoading.value, ref: tabUnavailableRef },
]);

const clickHandler = (currentTab: Tab) => {
	tabActive.value = currentTab;
};

const switchTabAndFocus = async (tabId: Tab) => {
	tabActive.value = tabId;
	await nextTick();
	const activeConfig = tabsConfig.value.find((t) => t.id === tabId);
	activeConfig?.ref.value?.focus();
};

const keydownHandler = (event: KeyboardEvent) => {
	const enabledTabs = tabsConfig.value.filter((t) => !t.disabled);
	if (enabledTabs.length <= 1) return;

	const currentIndex = enabledTabs.findIndex((t) => t.id === tabActive.value);
	let targetTab: Tab | null = null;

	switch (event.key) {
		case 'ArrowRight':
		case 'ArrowDown':
			event.preventDefault();
			targetTab = enabledTabs[(currentIndex + 1) % enabledTabs.length].id;
			break;

		case 'ArrowLeft':
		case 'ArrowUp':
			event.preventDefault();
			targetTab = enabledTabs[(currentIndex - 1 + enabledTabs.length) % enabledTabs.length].id;
			break;

		case 'Home':
			event.preventDefault();
			targetTab = enabledTabs[0].id;
			break;

		case 'End':
			event.preventDefault();
			targetTab = enabledTabs[enabledTabs.length - 1].id;
			break;
	}

	if (targetTab) {
		switchTabAndFocus(targetTab);
	}
};

watch([productsAvailable, productsUnavailable], () => {
	if (tabActive.value === 'available' && !productsAvailable.value.length && productsUnavailable.value.length) {
		tabActive.value = 'unavailable';
	} else if (tabActive.value === 'unavailable' && !productsUnavailable.value.length && productsAvailable.value.length) {
		tabActive.value = 'available';
	}
});

// Loading Cart products
onMounted(() => {
	isLoading.value = true;
	GET_CART()
		.then((response: Product[]) => {
			products.value = response;
			if (!productsAvailable.value.length && productsUnavailable.value.length) {
				tabActive.value = 'unavailable';
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
			isLoading.value = false;
		});
});
</script>
