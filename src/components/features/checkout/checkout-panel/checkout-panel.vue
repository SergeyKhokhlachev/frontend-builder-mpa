<template>
	<div class="checkout-panel">
		<div class="checkout-panel__total">
			<span>Итого:</span>
			<span>{{ priceFormatter.format(priceTotal) }}</span>
		</div>
		<checkout-promocode :promocodes :loading="promocodesLoading" @submit="submitHandler" @remove="removeHandler" />
		<div class="checkout-panel__box">
			<div class="checkout-panel__item">
				<span class="checkout-panel__name">{{ products.length }} товара</span>
				<span class="checkout-panel__value">{{ priceFormatter.format(priceOld) }}</span>
			</div>
		</div>
		<div class="checkout-panel__box">
			<div class="checkout-panel__item">
				<span class="checkout-panel__name">Скидка</span>
				<span class="checkout-panel__value">{{ priceFormatter.format(saleTotal) }}</span>
			</div>
			<div class="checkout-panel__item-sub">
				<span class="checkout-panel__name">По акции</span>
				<span class="checkout-panel__value">{{ priceFormatter.format(saleAction) }}</span>
			</div>
			<div class="checkout-panel__item-sub">
				<span class="checkout-panel__name">По промокоду</span>
				<span class="checkout-panel__value">{{ priceFormatter.format(salePromo) }}</span>
			</div>
		</div>
		<div class="checkout-panel__box">
			<div class="checkout-panel__item">
				<span class="checkout-panel__name">Доставка</span>
				<span class="checkout-panel__value">{{ isCheckout ? priceFormatter.format(delivery) : '—' }}</span>
			</div>
		</div>
		<div class="checkout-panel__footer">
			<button
				v-if="isCheckout"
				:class="['checkout-panel__button button button--primary', { loading: loading }]"
				type="submit"
				form="checkout-form"
			>
				<span>Оформить заказ</span>
			</button>
			<button v-else class="checkout-panel__button button button--primary" type="button" @click="checkoutHandler">
				<span>Перейти к оформлению</span>
			</button>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import { priceFormatter } from '@/common/helpers';
import CheckoutPromocode from '@/components/features/checkout/checkout-promocode/checkout-promocode.vue';
import type { Product, Promocode } from '@/components/features/checkout/checkout.types';

import { SEND_PROMOCODE } from '@/api/request';

const props = withDefaults(
	defineProps<{
		products: Product[];
		delivery: number;
		loading: boolean;
	}>(),
	{},
);

const emit = defineEmits<{
	checkout: [];
}>();

const promocodes = ref<Promocode[]>([]);
const promocodesLoading = ref(false);
const isCheckout = ref(false);

const priceNew = computed(() => props.products.reduce((acc, product) => acc + product.priceNew * product.added, 0));
const priceOld = computed(() => props.products.reduce((acc, product) => acc + product.priceOld * product.added, 0));

const salePromo = computed(() => promocodes.value.reduce((acc, promocode) => acc - promocode.sale, 0));
const saleAction = computed(() => priceNew.value - priceOld.value);
const saleTotal = computed(() => saleAction.value + salePromo.value);

const priceTotal = computed(() => priceOld.value + saleTotal.value + props.delivery);

const removeHandler = (id: string) => {
	const targetIndex = promocodes.value.findIndex((p) => p.id === id);
	if (targetIndex === -1) return;
	promocodes.value.splice(targetIndex, 1);
};

const submitHandler = (value: string) => {
	if (promocodes.value.some((promocode) => promocode.value === value)) {
		window.app.notify?.append({
			type: 'warning',
			delay: 10000,
			title: 'Промокод',
			text: `Введенный вами промокод <b>${value}</b> уже был применен`,
		});
	} else {
		promocodesLoading.value = true;
		SEND_PROMOCODE(value)
			.then((response: Promocode | null) => {
				if (response) promocodes.value.push(response);
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
				promocodesLoading.value = false;
			});
	}
};

const checkoutHandler = () => {
	isCheckout.value = true;
	emit('checkout');
};
</script>
