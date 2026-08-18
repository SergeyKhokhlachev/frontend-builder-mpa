interface Marker {
	color: string;
	background: string;
	value: string;
}

interface ColorOption {
	name: string;
	color: string;
	title: string;
}

export interface Product {
	id: string;
	href: string;
	category: string;
	name: string;
	article: string;
	priceNew: string;
	priceOld: string;
	rating: string;
	comments: string;
	quantity: string;
	favorite: boolean;
	compare: boolean;
	available: boolean;
	describe: string;
	image: string;
	markers: Marker[];
	colors: ColorOption[];
	sizes: string[];
}
