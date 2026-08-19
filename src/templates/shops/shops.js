import { hasDestroy } from '@/common/helpers';

import SwiperCarusel from '@/components/shared/swiper/swiper-carusel/swiper-carusel';

export const shopsPage = {
	shops: null,
	swiperViewed: null,

	async init(container) {
		const $shops = container.querySelector('.js-shops-vue');
		if ($shops) {
			try {
				const [{ createApp }, { createYmaps }, { default: Shops }] = await Promise.all([
					import('vue'),
					import('vue-yandex-maps'),
					import('@/components/features/shops/shops.vue'),
				]);

				this.shops = createApp(Shops)
					.use(
						createYmaps({
							apikey: import.meta.env.VITE_YMAP_API_KEY,
							lang: 'ru_RU',
						}),
					)
					.mount($shops);
			} catch (error) {
				console.error(error);
			}
		}

		const $swiperViewed = container.querySelector('.js-swiper-viewed');
		if ($swiperViewed) this.swiperViewed = new SwiperCarusel($swiperViewed);
	},

	destroy() {
		this.shops?.unmount();
		this.shops = null;

		if (hasDestroy(this.swiperViewed)) this.swiperViewed.destroy();
		this.swiperViewed = null;
	},
};
