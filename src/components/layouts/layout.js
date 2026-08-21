import Picture from '@/components/shared/picture/picture';
import Collapse from '@/components/shared/collapse/collapse';
import Dropdown from '@/components/shared/dropdown/dropdown';
import Tabs from '@/components/shared/tabs/tabs';

import Header from '@/components/layouts/header/header';
import Footer from '@/components/layouts/footer/footer';

export default async function initLayout() {
	const $header = document.querySelector('.js-header');
	if ($header) {
		$header.querySelectorAll('.js-dropdown').forEach((element) => {
			new Dropdown(element);
		});
		$header.querySelectorAll('.js-tabs').forEach((element) => {
			new Tabs(element);
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

	const { default: Search } = await import('@/components/features/search/search');
	document.querySelectorAll('.js-search').forEach((element) => {
		new Search(element);
	});

	const { default: Location } = await import('@/components/features/location/location');
	document.querySelectorAll('.js-location').forEach((element) => {
		new Location(element);
	});

	const $callback = document.querySelector('.js-callback');
	if ($callback) {
		const { default: Callback } = await import('@/components/features/callback/callback-form/callback-form');
		new Callback($callback);
	}

	const $subscribe = document.querySelector('.js-subscribe');
	if ($subscribe) {
		const { default: Subscribe } = await import('@/components/features/subscribe/subscribe');
		new Subscribe($subscribe);
	}

	const $login = document.querySelector('.js-login-vue');
	const $locationSearch = document.querySelector('.js-location-search-vue');
	const $checkoutPreview = document.querySelector('.js-checkout-preview-vue');

	if ($login || $locationSearch || $checkoutPreview) {
		const { createApp } = await import('vue');

		if ($login) {
			try {
				const { default: Login } = await import('@/components/features/login/login.vue');
				createApp(Login).mount($login);
			} catch (error) {
				console.error(error);
			}
		}
		if ($locationSearch) {
			try {
				const { default: LocationSearch } = await import('@/components/features/location/location-search/location-search.vue');
				createApp(LocationSearch).mount($locationSearch);
			} catch (error) {
				console.error(error);
			}
		}
		if ($checkoutPreview) {
			try {
				const { default: CheckoutPreview } = await import('@/components/features/checkout/checkout-preview/checkout-preview.vue');
				createApp(CheckoutPreview).mount($checkoutPreview);
			} catch (error) {
				console.error(error);
			}
		}
	}

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
