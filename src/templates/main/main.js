import { hasDestroy } from '@/common/helpers';
import { breakpoint } from '@/common/breakpoint';

import SwiperBanner from '@/components/shared/swiper/swiper-banner/swiper-banner';
import SwiperCarusel from '@/components/shared/swiper/swiper-carusel/swiper-carusel';

import { createApp } from 'vue';
import MainFaq from '@/components/features/common/main-faq/main-faq.vue';

export const mainPage = {
	swiperBanner: null,
	swiperCategory: null,
	swiperReviews: null,
	mainFaq: null,
	mediaQuery: null,

	init(container) {
		const $swiperBanner = container.querySelector('.js-swiper-banner');
		if ($swiperBanner) this.swiperBanner = new SwiperBanner($swiperBanner);

		const $swiperCategory = container.querySelector('.js-swiper-category');
		if ($swiperCategory) this.swiperCategory = new SwiperCarusel($swiperCategory);

		const $swiperReviews = container.querySelector('.js-swiper-reviews');
		if ($swiperReviews) this.swiperReviews = new SwiperCarusel($swiperReviews);

		const $mainFaq = container.querySelector('.js-faq-vue');
		if ($mainFaq) this.formVue = createApp(MainFaq).mount($mainFaq);

		this.mediaQuery = window.matchMedia(`(width >= ${breakpoint.desktopS}px)`);

		this.mediaHandler = this.mediaHandler.bind(this);
		this.mediaQuery.addEventListener('change', this.mediaHandler);

		if (this.mediaQuery.matches) {
			this.swiperCategory.swiper.slideTo(0, 0);
			this.swiperCategory.swiper.disable();
		}
	},

	destroy() {
		if (hasDestroy(this.swiperBanner)) this.swiperBanner.destroy();
		this.swiperBanner = null;

		if (hasDestroy(this.swiperCategory)) this.swiperCategory.destroy();
		this.swiperCategory = null;

		if (hasDestroy(this.swiperReviews)) this.swiperReviews.destroy();
		this.swiperReviews = null;

		this.mainFaq?.unmount();
		this.mainFaq = null;

		this.mediaQuery?.removeEventListener('change', this.mediaHandler);
		this.mediaQuery = null;
	},

	mediaHandler(event) {
		if (event.matches) {
			this.swiperCategory.swiper.slideTo(0, 0);
			this.swiperCategory.swiper.disable();
		} else {
			this.swiperCategory.swiper.enable();
		}
	},
};
