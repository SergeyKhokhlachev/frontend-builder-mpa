import '@/app/app.css';
import './test.css';

import '@/app/app';

import { swiperBanner } from '@/components/swiper/swiper-banner/swiper-banner';
import { swiperCarousel } from '@/components/swiper/swiper-carousel/swiper-carousel';

import { faqAjax } from '@/components/block/faq/_faq-ajax';

window.app.swiperBanner = swiperBanner;
window.app.swiperCarousel = swiperCarousel;

window.addEventListener('DOMContentLoaded', () => {
	faqAjax();

	document.querySelectorAll('.js-swiper-banner').forEach((element) => {
		app.swiperBanner(element);
	});

	document.querySelectorAll('.js-swiper-reviews').forEach((element) => {
		app.swiperCarousel(element);
	});
});

// NOTE: only for debugging
// if (process.env.NODE_ENV === 'development') {
// 	import('../../components/faq/_faq-ajax').then((module) => {
// 		module.faqAjax();
// 	});
// }
