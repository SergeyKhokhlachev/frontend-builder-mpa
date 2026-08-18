import { hasDestroy } from '@/common/helpers';

import Collapse from '@/components/shared/collapse/collapse';
import Dropdown from '@/components/shared/dropdown/dropdown';
import Tabs from '@/components/shared/tabs/tabs';

import { createApp } from 'vue';
import uikitFormVue from '@/components/features/uikit/uikit-form-vue/uikit-form-vue.vue';
import uikitFormNative from '@/components/features/uikit/uikit-form-native/uikit-form-native';

export const uikitPage = {
	collapses: [],
	dropdowns: [],
	tabs: [],
	formVue: null,
	formNative: null,

	init(container) {
		container.querySelectorAll('.js-collapse').forEach((element) => {
			this.collapses.push(new Collapse(element));
		});
		container.querySelectorAll('.js-dropdown').forEach((element) => {
			this.dropdowns.push(new Dropdown(element));
		});
		container.querySelectorAll('.js-tabs').forEach((element) => {
			this.tabs.push(new Tabs(element));
		});

		document.querySelectorAll('.js-ui-notify').forEach(($button) => {
			$button.addEventListener('click', this.appendNotify);
		});

		const $formVue = document.querySelector('.js-uikit-form-vue');
		if ($formVue) this.formVue = createApp(uikitFormVue).mount($formVue);

		const $formNative = document.querySelector('.js-uikit-form-native');
		if ($formNative) {
			this.formNative = uikitFormNative($formNative);
			this.formNative.init();
		}
	},

	destroy() {
		this.collapses.forEach((collapse) => {
			if (hasDestroy(collapse)) collapse.destroy();
		});
		this.collapses = [];

		this.dropdowns.forEach((dropdown) => {
			if (hasDestroy(dropdown)) dropdown.destroy();
		});
		this.dropdowns = [];

		this.tabs.forEach((tab) => {
			if (hasDestroy(tab)) tab.destroy();
		});
		this.tabs = [];

		document.querySelectorAll('.js-ui-notify').forEach(($button) => {
			$button.removeEventListener('click', this.appendNotify);
		});

		this.formVue?.unmount();
		this.formVue = null;

		this.formNative?.destoy();
		this.formNative = null;
	},

	appendNotify(event) {
		window.app.notify.append({
			type: event.target.dataset.notify,
			delay: 3000,
			title: 'Уведомление',
			text: 'Данные успешно сохранены!',
		});
	},
};
