import Swiper from 'swiper';
import { Navigation, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

export const swiperCarousel = (container, breakpoints = {}) => {
	new Swiper(container, {
		modules: [Navigation, Scrollbar],
		slidesPerView: 'auto',
		spaceBetween: 0,
		navigation: {
			prevEl: container.parentElement.querySelector('.js-swiper-prev'),
			nextEl: container.parentElement.querySelector('.js-swiper-next'),
		},
		scrollbar: {
			el: container.parentElement.querySelector('.js-swiper-scrollbar'),
			hide: false,
			draggable: true,
		},
		breakpoints: breakpoints,
	});
};
