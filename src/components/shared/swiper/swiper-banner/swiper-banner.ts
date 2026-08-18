import { classInstance } from '@/common/helpers';

import Swiper from 'swiper';
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default class SwiperBanner {
	readonly $container: HTMLElement;
	readonly selectorNext: string;
	readonly selectorPrev: string;
	readonly selectorPagination: string;

	protected swiper: Swiper | null = null;

	constructor(selector: HTMLElement) {
		this.$container = selector;

		this.selectorNext = '.js-swiper-next';
		this.selectorPrev = '.js-swiper-prev';
		this.selectorPagination = '.js-swiper-pagination';

		this.init();
	}

	init() {
		classInstance.set(this.$container, { swiperBanner: this });

		const $swiper = this.$container.querySelector('.swiper') as HTMLElement;
		if (!$swiper) return;

		this.swiper = new Swiper($swiper, {
			modules: [Navigation, Pagination, EffectFade, Autoplay],
			slidesPerView: 1,
			spaceBetween: 0,
			rewind: true,
			effect: 'fade',
			fadeEffect: {
				crossFade: true,
			},
			autoplay: {
				delay: 5000,
				disableOnInteraction: false,
				pauseOnMouseEnter: true,
			},
			pagination: {
				el: this.$container.querySelector(this.selectorPagination),
				clickable: true,
			},
			navigation: {
				prevEl: this.$container.querySelector(this.selectorPrev),
				nextEl: this.$container.querySelector(this.selectorNext),
			},
		});
	}

	destroy() {
		classInstance.del(this.$container, 'swiperBanner');
		this.swiper?.destroy(true, true);
	}

	update() {
		this.destroy();
		this.init();
	}
}
