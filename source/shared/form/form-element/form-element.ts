/**
 * @desc UI Компонент FormElement
 * @category 3 Form
 * @constructor
 * @param {HTMLElement} selector - HTMLElement формы
 * @param {Object} [options] - опции конфигурации
 * @param {String} [options.selectorContainer=".js-form-element"] - селектор контейнера элемента
 * @param {String} [options.selectorMessage=".js-form-element__message"] - селектор блока для вывода сообщений
 */

export class FormElement {
	readonly $element: HTMLElement;
	readonly selectorContainer: string;
	readonly selectorMessage: string;

	protected valid: boolean;
	protected error: boolean;
	protected messageComputed: string;

	protected $container: HTMLElement | null;
	protected $messageContainer: HTMLElement | null;

	constructor(
		selector: HTMLElement,
		options: {
			selectorContainer?: string;
			selectorMessage?: string;
		} = {},
	) {
		this.$element = selector;

		if (!this.$element) return;

		this.valid = false;
		this.error = false;

		this.selectorContainer = options.selectorContainer || '.js-form-element';
		this.selectorMessage = options.selectorMessage || '.js-form-element__message';

		this.$container = this.$element.closest(this.selectorContainer);
	}

	public init(): void {
		this.$messageContainer = this.$container.querySelector(this.selectorMessage);
	}

	/**
	 * @desc Обновить визуальное состояние элемента
	 * @example
	 * const myElement= app.classInstance.get(document.querySelector('#my-element'));
	 * myElement.formElement.render();
	 */
	public render(): void {
		this.$container?.classList.toggle('valid', this.valid);
		this.$container?.classList.toggle('error', this.error);
		if (this.$messageContainer) this.$messageContainer.innerHTML = this.messageComputed;
	}
}
