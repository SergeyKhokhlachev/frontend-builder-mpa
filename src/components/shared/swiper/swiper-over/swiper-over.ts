import { classInstance } from '@/common/helpers';

import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

export default class SwiperOver {
	readonly $container: HTMLElement;
	readonly selectorPagination: string;

	protected swiper: Swiper | null = null;

	constructor(selector: HTMLElement) {
		this.$container = selector;
		this.selectorPagination = '.js-swiper-pagination';

		this.init();
	}

	init() {
		classInstance.set(this.$container, { swiperOver: this });

		const $swiper = this.$container.querySelector('.swiper') as HTMLElement;
		if (!$swiper) return;

		this.swiper = new Swiper($swiper, {
			modules: [Pagination],
			slidesPerView: 1,
			spaceBetween: 0,
			pagination: {
				el: this.$container.querySelector(this.selectorPagination),
				clickable: true,
			},
			on: {
				init(swiper) {
					swiper.pagination.el.addEventListener('mouseover', (event: Event) => {
						const target = event.target as HTMLElement;
						const bullet = target.closest('.swiper-pagination-bullet') as HTMLElement;
						if (bullet) swiper.slideTo(swiper.pagination.bullets.indexOf(bullet));
					});
				},
			},
		});
	}

	destroy() {
		classInstance.del(this.$container, 'swiperOver');
		this.swiper?.destroy(true, true);
	}

	update() {
		this.destroy();
		this.init();
	}
}
