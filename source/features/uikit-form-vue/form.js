import { createApp } from 'vue';

import FormApp from './form.vue';

export function formDemoVue(container) {
	if (container) {
		createApp(FormApp).mount(container);
	}
}
