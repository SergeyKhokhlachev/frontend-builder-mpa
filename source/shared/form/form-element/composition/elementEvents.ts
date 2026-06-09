export function useElementChange(element: HTMLElement, data: object): void {
	element.dispatchEvent(
		/**
		 * @desc Событие изменения значения элемента формы.
		 * @category 3 Form
		 * @event Form#elementChange
		 * @property {Object} detail.data - данные элемента формы
		 * @example
		 * document.querySelector('[required]').addEventListener('elementChange', (event) => {
		 * 	console.log(event.detail.data);
		 * });
		 */
		new CustomEvent('elementChange', {
			detail: {
				data: data,
			},
		}),
	);
}

export function useElementComplete(element: HTMLElement, data: object): void {
	element.dispatchEvent(
		/**
		 * @desc Событие успешной валидации поля.
		 * @category 3 Form
		 * @event Form#elementComplete
		 * @property {Object} detail.data - данные элемента формы
		 * @example
		 * document.querySelector('[required]').addEventListener('elementComplete', (event) => {
		 * 	console.log(event.detail.data);
		 * });
		 */
		new CustomEvent('elementComplete', {
			detail: {
				data: data,
			},
		}),
	);
}
