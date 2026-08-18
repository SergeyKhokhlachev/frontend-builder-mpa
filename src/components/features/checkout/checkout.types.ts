export type Tab = 'available' | 'unavailable';

export interface TabItem {
	name: Tab;
	id: string;
	panelId: string;
	label: string;
	quantity?: number;
}

export interface Promocode {
	id: string;
	value: string;
	status: string;
	message: string;
	sale: number;
}

export interface Product {
	id: string;
	href: string;
	name: string;
	article: string;
	priceNew: number;
	priceOld: number;
	quantity: number;
	added: number;
	favorite: boolean;
	available: boolean;
	image: string;
	color: string;
	size: string;
}

export type Delivery = 'courier' | 'post' | 'pickup';

export interface FormData {
	name: string;
	email: string;
	tel: string;
	accept: boolean;
	delivery: Delivery;
	address: string;
	apartment: string;
	index: string;
	payment: string;
}
