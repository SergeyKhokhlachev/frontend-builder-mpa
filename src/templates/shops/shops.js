import { hasDestroy } from '@/common/helpers';

import { createApp } from 'vue';
import { createYmaps } from 'vue-yandex-maps';

import Shops from '@/components/features/shops/shops.vue';
import SwiperCarusel from '@/components/shared/swiper/swiper-carusel/swiper-carusel';

export const shopsPage = {
	shops: null,
	swiperViewed: null,

	init(container) {
		const $shops = container.querySelector('.js-shops-vue');
		if ($shops) {
			this.shops = createApp(Shops)
				.use(
					createYmaps({
						apikey: import.meta.env.VITE_YMAP_API_KEY,
						lang: 'ru_RU',
					}),
				)
				.mount($shops);
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
