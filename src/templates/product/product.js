import { hasDestroy } from '@/common/helpers';
import Tabs from '@/components/shared/tabs/tabs';
import SwiperThumbs from '@/components/shared/swiper/swiper-thumbs/swiper-thumbs';
import SwiperCarusel from '@/components/shared/swiper/swiper-carusel/swiper-carusel';

export const productPage = {
	productTabs: null,
	swiperThumbs: null,
	swiperViewed: null,

	async init(container) {
		const $productTabs = container.querySelector('.js-product-block-tabs');
		if ($productTabs) this.productTabs = new Tabs($productTabs);

		const $swiperThumbs = container.querySelector('.js-swiper-thumbs');
		if ($swiperThumbs) this.swiperThumbs = new SwiperThumbs($swiperThumbs);

		const $swiperViewed = container.querySelector('.js-swiper-viewed');
		if ($swiperViewed) this.swiperViewed = new SwiperCarusel($swiperViewed);
	},

	destroy() {
		if (hasDestroy(this.productTabs)) this.productTabs.destroy();
		this.productTabs = null;

		if (hasDestroy(this.swiperThumbs)) this.swiperThumbs.destroy();
		this.swiperThumbs = null;

		if (hasDestroy(this.swiperViewed)) this.swiperViewed.destroy();
		this.swiperViewed = null;
	},
};
