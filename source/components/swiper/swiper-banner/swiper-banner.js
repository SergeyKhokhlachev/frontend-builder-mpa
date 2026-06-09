import Swiper from 'swiper';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export const swiperBanner = (container) => {
	new Swiper(container, {
		modules: [Navigation, Pagination, EffectFade],
		slidesPerView: 1,
		spaceBetween: 0,
		rewind: true,
		effect: 'fade',
		fadeEffect: {
			crossFade: true,
		},
		pagination: {
			el: container.parentElement.querySelector('.js-swiper-pagination'),
			clickable: true,
		},
		navigation: {
			prevEl: container.parentElement.querySelector('.js-swiper-prev'),
			nextEl: container.parentElement.querySelector('.js-swiper-next'),
		},
	});
};
