export type NotifyType = 'error' | 'warning' | 'success' | 'default';

export interface NotifyElementOptions {
	id?: string;
	type?: NotifyType;
	delay?: number;
	title?: string;
	text?: string;
}
