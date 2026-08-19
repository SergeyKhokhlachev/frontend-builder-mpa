export const checkoutPage = {
	checkout: null,

	async init(container) {
		const $checkout = container.querySelector('.js-checkout-vue');
		if ($checkout) {
			try {
				const [{ createApp }, { default: Checkout }] = await Promise.all([
					import('vue'),
					import('@/components/features/checkout/checkout.vue'),
				]);

				this.formVue = createApp(Checkout).mount($checkout);
			} catch (error) {
				console.error(error);
			}
		}
	},

	destroy() {
		this.checkout?.unmount();
		this.checkout = null;
	},
};
