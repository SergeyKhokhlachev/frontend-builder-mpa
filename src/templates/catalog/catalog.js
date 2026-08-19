import { hasDestroy } from '@/common/helpers';
import { breakpoint } from '@/common/breakpoint';

import Collapse from '@/components/shared/collapse/collapse';
import Sticky from '@/components/shared/sticky/sticky';
import SwiperOver from '@/components/shared/swiper/swiper-over/swiper-over';
import SwiperCarusel from '@/components/shared/swiper/swiper-carusel/swiper-carusel';
import ProductFilter from '@/components/features/product/product-filter/product-filter';
import Form from '@/components/shared/form/form';

export const catalogPage = {
	collapses: [],
	sticky: null,
	swiperCards: [],
	swiperViewed: null,
	productFilter: null,
	productSort: null,

	async init(container) {
		container.querySelectorAll('.js-collapse').forEach((element) => {
			this.collapses.push(new Collapse(element));
		});

		const $sticky = container.querySelector('.js-sticky');
		if ($sticky) this.sticky = new Sticky($sticky, { breakpoint: breakpoint.desktopS });

		container.querySelectorAll('.js-swiper-over').forEach((swiper) => {
			this.swiperCards.push(new SwiperOver(swiper));
		});

		const $swiperViewed = container.querySelector('.js-swiper-viewed');
		if ($swiperViewed) this.swiperViewed = new SwiperCarusel($swiperViewed);

		const $productFilter = container.querySelector('.js-filter');
		if ($productFilter) this.productFilter = new ProductFilter($productFilter);

		const $productSort = container.querySelector('.js-product-sort');
		if ($productSort) this.productSort = new Form($productSort);
	},

	destroy() {
		this.collapses.forEach((collapse) => {
			if (hasDestroy(collapse)) collapse.destroy();
		});

		if (hasDestroy(this.sticky)) this.sticky.destroy();
		this.sticky = null;

		this.swiperCards.forEach((swiper) => {
			if (hasDestroy(swiper)) swiper.destroy();
		});

		if (hasDestroy(this.swiperViewed)) this.swiperViewed.destroy();
		this.swiperViewed = null;

		if (hasDestroy(this.productFilter)) this.productFilter.destroy();
		this.productFilter = null;

		if (hasDestroy(this.productSort)) this.productSort.destroy();
		this.productSort = null;
	},
};
