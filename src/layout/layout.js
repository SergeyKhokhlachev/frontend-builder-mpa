import Picture from '@/components/shared/picture/picture';
import Collapse from '@/components/shared/collapse/collapse';
import Dropdown from '@/components/shared/dropdown/dropdown';
import Tabs from '@/components/shared/tabs/tabs';

import Header from '@/layout/header/header';
import Footer from '@/layout/footer/footer';
import Search from '@/components/features/search/search';
import Location from '@/components/features/location/location';
import Subscribe from '@/components/features/subscribe/subscribe';
import Callback from '@/components/features/callback/callback-form/callback-form';

import { createApp } from 'vue';
import Login from '@/components/features/login/login.vue';
import LocationSearch from '@/components/features/location/location-search/location-search.vue';
import CheckoutPreview from '@/components/features/checkout/checkout-preview/checkout-preview.vue';

export default function initLayout() {
	const $header = document.querySelector('.js-header');
	if ($header) {
		$header.querySelectorAll('.js-dropdown').forEach((element) => {
			new Dropdown(element);
		});
		$header.querySelectorAll('.js-tabs').forEach((element) => {
			new Tabs(element);
		});
		$header.querySelectorAll('.js-search').forEach((element) => {
			new Search(element);
		});
		$header.querySelectorAll('.js-location').forEach((element) => {
			new Location(element);
		});
		$header.querySelectorAll('.picture.js-picture').forEach((element) => {
			new Picture(element);
		});

		new Header($header);
	}

	const $footer = document.querySelector('.js-footer');
	if ($footer) {
		$footer.querySelectorAll('.js-collapse').forEach((element) => {
			new Collapse(element);
		});

		$footer.querySelectorAll('picture.js-picture').forEach((element) => {
			new Picture(element);
		});
		new Footer($footer);
	}

	const $callback = document.querySelector('.js-callback');
	if ($callback) new Callback($callback);

	const $subscribe = document.querySelector('.js-subscribe');
	if ($subscribe) new Subscribe($subscribe);

	const $login = document.querySelector('.js-login-vue');
	if ($login) createApp(Login).mount($login);

	const $locationSearch = document.querySelector('.js-location-search-vue');
	if ($locationSearch) createApp(LocationSearch).mount($locationSearch);

	const $checkoutPreview = document.querySelector('.js-checkout-preview-vue');
	if ($checkoutPreview) createApp(CheckoutPreview).mount($checkoutPreview);

	const modalLogin = document.querySelector('#modal-login');

	modalLogin?.addEventListener('modalOpen', () => {
		window.app.notify?.append({
			id: 'form-data',
			title: 'Тестовые данные форм:',
			text: `
			email: <b>email@mail.ru</b><br/>
			password: <b>123456</b><br/>
			tel: <b>+7(999) 999-99-99</b><br/>
			code: <b>999999</b>
		`,
		});
	});

	modalLogin?.addEventListener('modalClose', () => {
		const dataNotify = window.app.classInstance.get(document.querySelector('#form-data'));
		if (dataNotify) dataNotify.notify.close();
	});
}
