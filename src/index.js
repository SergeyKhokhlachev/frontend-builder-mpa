import { classInstance, hasDestroy } from '@/common/helpers';
import barba from '@barba/core';

import Modal from '@/components/shared/modal/modal';
import Notify from '@/components/shared/notify/notify';
import Picture from '@/components/shared/picture/picture';

import initLayout from '@/layout/layout';
import { uikitPage } from '@/templates/ui-kit/ui-kit';
import { mainPage } from '@/templates/main/main';
import { shopsPage } from '@/templates/shops/shops';
import { categoryPage } from '@/templates/category/category';
import { catalogPage } from '@/templates/catalog/catalog';
import { productPage } from '@/templates/product/product';
import { checkoutPage } from '@/templates/checkout/checkout';

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
			afterEnter(data) {
				uikitPage.init(data.next.container);
			},
			beforeLeave() {
				uikitPage.destroy();
			},
		},
		{
			namespace: 'main',
			afterEnter(data) {
				mainPage.init(data.next.container);
			},
			beforeLeave() {
				mainPage.destroy();
			},
		},
		{
			namespace: 'shops',
			afterEnter(data) {
				shopsPage.init(data.next.container);
			},
			beforeLeave() {
				shopsPage.destroy();
			},
		},
		{
			namespace: 'category',
			afterEnter(data) {
				categoryPage.init(data.next.container);
			},
			beforeLeave() {
				categoryPage.destroy();
			},
		},
		{
			namespace: 'catalog',
			afterEnter(data) {
				catalogPage.init(data.next.container);
			},
			beforeLeave() {
				catalogPage.destroy();
			},
		},
		{
			namespace: 'product',
			afterEnter(data) {
				productPage.init(data.next.container);
			},
			beforeLeave() {
				productPage.destroy();
			},
		},
		{
			namespace: 'checkout',
			afterEnter(data) {
				checkoutPage.init(data.next.container);
			},
			beforeLeave() {
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
