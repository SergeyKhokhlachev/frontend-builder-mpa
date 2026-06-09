declare type Option = {
	value: string;
	text: string;
	selected?: boolean;
	complete?: boolean;
} & {
	[key: string]: string | number | boolean;
};

declare type OptionsVE = {
	noRender?: boolean;
	noEmpty?: boolean;
	rule?: string;
	message?: string;
	size?: number;
	accept?: string;
};

declare type ResultVE = {
	valid: boolean;
	error: boolean;
	message: string;
};

declare type ResultVF = {
	valid: boolean;
	looked: boolean;
};

declare type ReaderEll = {
	name: string;
	ext: string;
	src: string | ArrayBuffer;
	img: boolean;
};
