import { classInstance } from '@/common/helpers';

import Swiper from 'swiper';
import { Navigation, Scrollbar } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

interface SwiperCaruselOptions {
	view?: number | 'auto';
	breakpoints?: { [width: number]: SwiperOptions; [ratio: string]: SwiperOptions };
}

export default class SwiperCarusel {
	readonly $container: HTMLElement;
	readonly selectorNext: string;
	readonly selectorPrev: string;
	readonly selectorScrollbar: string;

	protected swiper: Swiper | null = null;
	protected view: number | 'auto';
	protected breakpoints: { [width: number]: SwiperOptions; [ratio: string]: SwiperOptions } | undefined;

	constructor(selector: HTMLElement, options: SwiperCaruselOptions = {}) {
		this.$container = selector;

		this.selectorNext = '.js-swiper-next';
		this.selectorPrev = '.js-swiper-prev';
		this.selectorScrollbar = '.js-swiper-scrollbar';

		this.view = options.view || 'auto';
		this.breakpoints = options.breakpoints;

		this.init();
	}

	init() {
		classInstance.set(this.$container, { swiperCarusel: this });

		const $swiper = this.$container.querySelector('.swiper') as HTMLElement;
		if (!$swiper) return;

		this.swiper = new Swiper($swiper, {
			modules: [Navigation, Scrollbar],
			slidesPerView: this.view,
			spaceBetween: 0,
			rewind: true,
			navigation: {
				prevEl: this.$container.querySelector(this.selectorPrev),
				nextEl: this.$container.querySelector(this.selectorNext),
			},
			scrollbar: {
				el: this.$container.querySelector(this.selectorScrollbar),
				hide: false,
				draggable: true,
			},
			breakpoints: this.breakpoints,
		});
	}

	destroy() {
		classInstance.del(this.$container, 'swiperCarusel');
		this.swiper?.destroy(true, true);
	}

	update() {
		this.destroy();
		this.init();
	}
}
