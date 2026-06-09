import { createApp } from 'vue';

import ShopsApp from './shops.vue';

export function shopsComponent(container, options = {}) {
	if (container) {
		createApp(ShopsApp, { options: options }).mount(container);
	}
}
