import { createApp } from 'vue';
import Checkout from '@/components/features/checkout/checkout.vue';

export const checkoutPage = {
	checkout: null,

	init(container) {
		const $checkout = container.querySelector('.js-checkout-vue');
		if ($checkout) this.formVue = createApp(Checkout).mount($checkout);
	},

	destroy() {
		this.checkout?.unmount();
		this.checkout = null;
	},
};
