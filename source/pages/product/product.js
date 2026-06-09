import '@/app/app.css';
import './product.css';

import { ProductSwiper } from './product-swiper';

window.addEventListener('DOMContentLoaded', () => {
	new ProductSwiper(document.querySelector('.js-product-swiper'));
});
