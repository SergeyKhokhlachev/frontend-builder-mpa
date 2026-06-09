import { classInstance } from '@/shared/helpers/helpers';

import { FormElement } from '../form-element';

import { useElementChange, useElementComplete } from '../composition/elementEvents';
import { useGetValid } from './composition/getValid';
import { useAppendMask } from './composition/appendMask';
import { useRemoveMask } from './composition/removeMask';

/**
 * @desc UI Компонент FormInput
 * @category 3 Form
 * @example
 * new FormInput(document.querySelector('input[required]'));
 * @constructor
 * @param {HTMLInputElement} selector - HTMLInputElement формы
 * @param {Object} [options] - опции конфигурации
 * @param {string} [options.rule="text"] - имя правила для валидации, если не указанно - береться значение attr data-rule
 * @param {String} [options.message="text"] - имя правила для вывода сообщений об ошибке, если не указанно - береться значение attr data-message
 * @param {String} [options.mask] - маска элемента, если не указанно - береться значение attr data-mask
 */

export class FormInput extends FormElement {
	readonly $element: HTMLInputElement;
	readonly rule: string;
	readonly mask: string;

	protected message: string;
	protected value: string;

	constructor(
		selector: HTMLInputElement,
		options: {
			rule?: string;
			message?: string;
			mask?: string;
			selectorContainer?: string;
			selectorMessage?: string;
		} = {},
	) {
		super(selector, options);

		this.rule = options.rule || this.$element.dataset.rule || 'text';
		this.message = options.message || this.$element.dataset.message || 'text';
		this.mask = options.mask || this.$element.dataset.mask || '';

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init(): void {
		classInstance.set(this.$element, { formElement: this });

		super.init();

		if (this.mask) useAppendMask(this.$element);

		this.changeHandler = this.changeHandler.bind(this);
		this.$element.addEventListener('input', this.changeHandler);
		this.$element.addEventListener('change', this.changeHandler);
	}

	/**
	 * @desc Удалить обрабочики событий
	 */
	public destroy(): void {
		classInstance.del(this.$element, 'formElement');

		if (this.mask) useRemoveMask(this.$element);
		this.$element.removeEventListener('input', this.changeHandler);
		this.$element.removeEventListener('change', this.changeHandler);
	}

	/**
	 * @desc Переопределить обрабочики событий
	 * @example
	 * const myElement= app.classInstance.get(document.querySelector('input[required]'));
	 * myElement.formElement.reinit();
	 */
	public reinit(): void {
		this.destroy();
		this.init();
	}

	/**
	 * @desc Метод валидации элемента
	 * @param {Object} [options] - опции конфигурации
	 * @param {Boolean} [options.noRender=false] - если указать true - представление не будет обновляться при валидации.
	 * @param {Boolean} [options.noEmpty=false] - если указать true - пустое поле не будет валидироваться
	 * @param {String} [options.rule] - имя правила для валидации
	 * @param {String} [options.message] - имя правила для вывода сообщений об ошибке
	 * @returns {Boolean} результат валидации
	 * @example
	 * const myElement = app.classInstance.get(document.querySelector('input[required]'));
	 * myElement.formElement.validate();
	 */
	public validate(options: OptionsVE = {}): boolean {
		const optionsValidate: OptionsVE = {
			noRender: options.noRender || false,
			noEmpty: options.noEmpty || false,
			rule: options.rule || this.rule,
			message: options.message || this.message,
		};

		const result: ResultVE = useGetValid(this.$element, optionsValidate);

		if (result.message) this.messageComputed = result.message;
		if (result.valid && !result.error) useElementComplete(this.$element, { value: this.value });
		if (!optionsValidate.noRender) {
			this.valid = result.valid;
			this.error = result.error;
			this.render();
		}

		return result.valid;
	}

	private changeHandler(event: InputEvent): void {
		const $target: HTMLInputElement = event.target as HTMLInputElement;
		this.value = $target.value;
		useElementChange(this.$element, { value: this.value });
	}
}
