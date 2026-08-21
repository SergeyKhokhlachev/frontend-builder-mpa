import { classInstance, hasDestroy } from '@/common/helpers';
import barba from '@barba/core';

import Modal from '@/components/shared/modal/modal';
import Notify from '@/components/shared/notify/notify';
import Picture from '@/components/shared/picture/picture';

import initLayout from '@/components/layouts/layout';

window.app = {};
window.app.classInstance = classInstance;

Modal.getInstance();
Notify.getInstance();
initLayout();

barba.init({
	prevent: ({ event, href }) => {
		if (event && event.type === 'click') {
			if (href === window.location.href) {
				event.preventDefault();
				event.stopPropagation();
				return true;
			}
		}
	},
	views: [
		{
			namespace: 'ui-kit',
			async afterEnter(data) {
				const { uikitPage } = await import('@/templates/pages/ui-kit');
				uikitPage.init(data.next.container);
			},
			async beforeLeave() {
				const { uikitPage } = await import('@/templates/pages/ui-kit');
				uikitPage.destroy();
			},
		},
		{
			namespace: 'main',
			async afterEnter(data) {
				const { mainPage } = await import('@/templates/pages/main');
				mainPage.init(data.next.container);
			},
			async beforeLeave() {
				const { mainPage } = await import('@/templates/pages/main');
				mainPage.destroy();
			},
		},
		{
			namespace: 'shops',
			async afterEnter(data) {
				const { shopsPage } = await import('@/templates/pages/shops');
				await shopsPage.init(data.next.container);
			},
			async beforeLeave() {
				const { shopsPage } = await import('@/templates/pages/shops');
				shopsPage.destroy();
			},
		},
		{
			namespace: 'category',
			async afterEnter(data) {
				const { categoryPage } = await import('@/templates/pages/category');
				categoryPage.init(data.next.container);
			},
			async beforeLeave() {
				const { categoryPage } = await import('@/templates/pages/category');
				categoryPage.destroy();
			},
		},
		{
			namespace: 'catalog',
			async afterEnter(data) {
				const { catalogPage } = await import('@/templates/pages/catalog');
				catalogPage.init(data.next.container);
			},
			async beforeLeave() {
				const { catalogPage } = await import('@/templates/pages/catalog');
				catalogPage.destroy();
			},
		},
		{
			namespace: 'product',
			async afterEnter(data) {
				const { productPage } = await import('@/templates/pages/product');
				productPage.init(data.next.container);
			},
			async beforeLeave() {
				const { productPage } = await import('@/templates/pages/product');
				productPage.destroy();
			},
		},
		{
			namespace: 'checkout',
			async afterEnter(data) {
				const { checkoutPage } = await import('@/templates/pages/checkout');
				checkoutPage.init(data.next.container);
			},
			async beforeLeave() {
				const { checkoutPage } = await import('@/templates/pages/checkout');
				checkoutPage.destroy();
			},
		},
	],
});

const loader = document.querySelector('.js-page-loader');
let pictures = [];

barba.hooks.afterEnter((data) => {
	if (window.app.modal && typeof window.app.modal.reinit === 'function') {
		window.app.modal.reinit();
	}
	data.next.container.querySelectorAll('picture.js-picture').forEach((element) => {
		pictures.push(new Picture(element));
	});

	window.scrollTo(0, 0);
	loader.classList.toggle('active', false);
});

barba.hooks.beforeLeave(() => {
	loader.classList.toggle('active', true);
	pictures.forEach((picture) => {
		if (hasDestroy(picture)) picture.destroy();
	});
	pictures = [];
});
