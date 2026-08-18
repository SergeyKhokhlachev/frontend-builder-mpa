import type { FormChangeDetail, ElementValidateDetail, ElementChangeDetail } from '@/components/shared/form/form.types';

export function dispatchFormChange(element: HTMLFormElement, valid: boolean) {
	element.dispatchEvent(
		/**
		 * @desc Событие изменения значения элемента формы.
		 * @category 3 Form
		 * @event Form#formChange
		 * @property {Object} detail.vaild - статус формы
		 * @example
		 * document.querySelector('form').addEventListener('formChange', (event) => {
		 * 	console.log(event.detail.data);
		 * });
		 */
		new CustomEvent<FormChangeDetail>('formChange', {
			detail: {
				valid: valid,
			},
		}),
	);
}

export function dispatchElementValidate(element: HTMLElement, valid: boolean) {
	element.dispatchEvent(
		/**
		 * @desc Событие валидации элемента формы.
		 * @category 3 Form
		 * @event Form#elementValidate
		 * @property {Object} detail.valid - статус элемента формы
		 * @example
		 * document.querySelector('[required]').addEventListener('elementValidate', (event) => {
		 * 	console.log(event.detail.valid);
		 * });
		 */
		new CustomEvent<ElementValidateDetail>('elementValidate', {
			bubbles: true,
			cancelable: true,
			detail: {
				valid: valid,
			},
		}),
	);
}

export function dispatchElementChange(element: HTMLElement, value: string | boolean | File[]) {
	element.dispatchEvent(
		/**
		 * @desc Событие изменения элемента формы.
		 * @category 3 Form
		 * @event Form#elementChange
		 * @property {Object} detail.value - значение элемента формы
		 * @example
		 * document.querySelector('[required]').addEventListener('elementChange', (event) => {
		 * 	console.log(event.detail.value);
		 * });
		 */
		new CustomEvent<ElementChangeDetail>('elementChange', {
			bubbles: true,
			cancelable: true,
			detail: {
				value: value,
			},
		}),
	);
}
