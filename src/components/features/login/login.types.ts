export type ActiveView = 'authorization' | 'registration' | 'recovery' | 'result';

export type Tab = 'email' | 'tel';

export interface TabItem {
	value: string;
	label: string;
	id: string;
	panelId: string;
}

export interface LoadingType {
	tel: boolean;
	code: boolean;
	email: boolean;
	timer: boolean;
}

export type SubmitType = 'tel' | 'code' | 'email';
