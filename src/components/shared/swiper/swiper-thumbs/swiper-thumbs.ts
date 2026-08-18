import { classInstance } from '@/common/helpers';
import { breakpoint } from '@/common/breakpoint';

import Swiper from 'swiper';
import { FreeMode, Navigation, EffectFade, Thumbs } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export default class SwiperThumbs {
	readonly $container: HTMLElement;
	readonly selectorNext: string;
	readonly selectorPrev: string;
	readonly selectorMain: string;
	readonly selectorPreview: string;

	protected swiperMain: Swiper | null = null;
	protected swiperPreview: Swiper | null = null;

	constructor(selector: HTMLElement) {
		this.$container = selector;

		this.selectorNext = '.js-swiper-prev';
		this.selectorPrev = '.js-swiper-next';
		this.selectorMain = '.js-swiper-thumbs__main';
		this.selectorPreview = '.js-swiper-thumbs__preview';

		this.init();
	}

	init() {
		classInstance.set(this.$container, { swiperThumbs: this });

		const $swiperMain = this.$container.querySelector(this.selectorMain) as HTMLElement;
		const $swiperPreview = this.$container.querySelector(this.selectorPreview) as HTMLElement;

		if (!$swiperMain || !$swiperPreview) return;

		this.swiperPreview = new Swiper($swiperPreview, {
			modules: [FreeMode, EffectFade],
			slidesPerView: 'auto',
			freeMode: true,
			rewind: true,
			watchSlidesProgress: true,
			spaceBetween: 8,
			breakpoints: {
				[breakpoint.tablet]: {
					direction: 'vertical',
				},
			},
		});

		this.swiperMain = new Swiper($swiperMain, {
			modules: [Navigation, Thumbs, EffectFade],
			slidesPerView: 1,
			spaceBetween: 8,
			effect: 'fade',
			rewind: true,
			fadeEffect: {
				crossFade: true,
			},
			navigation: {
				prevEl: this.$container.querySelector('.js-swiper-prev'),
				nextEl: this.$container.querySelector('.js-swiper-next'),
			},
			thumbs: {
				swiper: this.swiperPreview,
			},
		});
	}

	destroy() {
		classInstance.del(this.$container, 'swiperThumbs');
		this.swiperMain?.destroy(true, true);
		this.swiperPreview?.destroy(true, true);
	}

	update() {
		this.destroy();
		this.init();
	}
}
