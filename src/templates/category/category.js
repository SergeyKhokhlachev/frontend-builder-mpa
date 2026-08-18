import { hasDestroy } from '@/common/helpers';

import SwiperCarusel from '@/components/shared/swiper/swiper-carusel/swiper-carusel';

export const categoryPage = {
	swiperViewed: null,

	init(container) {
		const $swiperViewed = container.querySelector('.js-swiper-viewed');
		if ($swiperViewed) this.swiperViewed = new SwiperCarusel($swiperViewed);
	},

	destroy() {
		if (hasDestroy(this.swiperViewed)) this.swiperViewed.destroy();
		this.swiperViewed = null;
	},
};
