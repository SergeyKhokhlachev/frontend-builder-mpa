import '@/app/app.css';
import './ui-kit.css';

import '@/app/app';
import '@/layouts/main/main';

import { notifyDemo } from '@/features/uikit-notify/notify';
import { formDemoVue } from '@/features/uikit-form-vue/form';
import { formDemoNative } from '@/features/uikit-form-native/form';
import { formDemoCode } from '@/features/uikit-form-code/form';

window.addEventListener('DOMContentLoaded', () => {
	notifyDemo();
	formDemoVue(document.querySelector('#form-uikit-vue'));
	formDemoNative(document.querySelector('.js-form-uikit-native'));
	formDemoCode(document.querySelector('.js-form-uikit-code'));

	document.querySelectorAll('.js-sticky-uikit').forEach((element) => {
		new app.Sticky(element, {
			breakpoint: vars.breakpoint.desktop,
			indentTop: 0,
			indentBottom: 20,
		});
	});

	document.querySelectorAll('.js-timer-uikit').forEach((element) => {
		const timer = new app.Timer(element, {
			count: '12/22/2024',
			format: (data) =>
				`${data.days.value} ${data.days.name} : 
				 ${data.hours.value} ${data.hours.name} : 
				 ${data.minutes.value} ${data.minutes.name} : 
				 ${data.seconds.value} ${data.seconds.name}`,
		});
		timer.start();
	});
});
