import '@/app/app.css';
import './category.css';

import '@/app/app';

import { swiperCarousel } from '@/components/swiper/swiper-carousel/swiper-carousel';

window.app.swiperCarousel = swiperCarousel;

window.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.js-swiper-actions').forEach((element) => {
		app.swiperCarousel(element);
	});
});
