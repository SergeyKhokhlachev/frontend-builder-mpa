import '@/app/app.css';
import './main.css';

import '@/app/app';

import { swiperBanner } from '@/components/swiper/swiper-banner/swiper-banner';
import { swiperCarousel } from '@/components/swiper/swiper-carousel/swiper-carousel';
import { shopsComponent } from '@/components/block/shops/index';

import { faqAjax } from '@/components/block/faq/_faq-ajax';

window.app.swiperBanner = swiperBanner;
window.app.swiperCarousel = swiperCarousel;
window.app.shopsComponent = shopsComponent;

window.addEventListener('DOMContentLoaded', () => {
	faqAjax();

	document.querySelectorAll('.js-swiper-banner').forEach((element) => {
		app.swiperBanner(element);
	});

	document.querySelectorAll('.js-swiper-reviews').forEach((element) => {
		app.swiperCarousel(element);
	});

	document.querySelectorAll('.js-shops').forEach((element) => {
		app.shopsComponent(element, { mode: 'section' });
	});
});

// NOTE: only for debugging
// if (process.env.NODE_ENV === 'development') {
// 	import('../../components/faq/_faq-ajax').then((module) => {
// 		module.faqAjax();
// 	});
// }
