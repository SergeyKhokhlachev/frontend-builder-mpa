/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { classInstance } from '@/common/helpers';
import Notify from '@/components/shared/notify/notify';
import Modal from '@/components/shared/modal/modal';

interface AppGlobal {
	classInstance: classInstance;
	notify?: Notify;
	modal?: Modal;
}

interface ImportMetaEnv {
	readonly VITE_YMAP_API_KEY: string;
	readonly VITE_DADATA_TOKEN: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare global {
	interface Window {
		app: AppGlobal;
	}
}

declare module '*.vue' {
	import type { DefineComponent } from 'vue';
	const component: DefineComponent<{}, {}, any>;
	export default component;
}
