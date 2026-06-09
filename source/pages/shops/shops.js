import '@/app/app.css';
import './shops.css';

import '@/app/app';

import { shopsComponent } from '@/components/block/shops/index';

window.app.shopsComponent = shopsComponent;

window.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.js-shops').forEach((element) => {
		app.shopsComponent(element, { mode: 'main' });
	});
});
