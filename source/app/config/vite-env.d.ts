declare interface Window {
	app: { [key: string]: unknown };
	vars: { [key: string]: unknown };
	instance: { [key: string]: unknown };
}

declare module '*.vue' {
	import type { DefineComponent } from 'vue';
	const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
	export default component;
}

declare module '*.webp';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
