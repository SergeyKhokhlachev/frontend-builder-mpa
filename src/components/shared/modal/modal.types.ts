import ModalElement from './modal-element/modal-element';

export interface ModalOptions {
	selectorModal?: string;
	selectorOpen?: string;
	selectorClose?: string;
	selectorLayer?: string;
	selectorWrapper?: string;
}

export interface ModalRegistry {
	modal: ModalElement;
}

export interface ModalElementOptions {
	selectorScroll?: string;
	selectorContent?: string;
}

export interface ModalOpenDetail {
	modal: ModalElement;
}

export interface ModalCloseDetail {
	modal: ModalElement;
}

export type ModalOpenEvent = CustomEvent<ModalOpenDetail>;
export type ModalCloseEvent = CustomEvent<ModalCloseDetail>;

declare global {
	interface HTMLElementEventMap {
		modalOpen: ModalOpenEvent;
		modalClose: ModalCloseEvent;
	}
}
