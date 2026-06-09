import { classInstance } from '@/shared/helpers/helpers';

import { FormElement } from '../form-element';

import { useElementChange, useElementComplete } from '../composition/elementEvents';
import { useGetValid } from './composition/getValid';

/**
 * @desc UI Компонент FormPassword
 * @category 3 Form
 * @example
 * new FormInput(document.querySelector('input[data-type="password"]'));
 * @constructor
 * @param {HTMLInputElement} selector - HTMLInputElement формы
 * @param {Object} [options] - опции конфигурации
 * @param {String} [options.message="password"] - имя правила для вывода сообщений об ошибке, если не указанно - береться значение attr data-message
 * @param {string} [options.rule="password"] - имя правила для валидации, если не указанно - береться значение attr data-rule
 * @param {String} [options.selectorButton=".js-form-element__button"] - селектор кнопки переключения видимости пароля
 */

export class FormPassword extends FormElement {
	readonly $element: HTMLInputElement;
	readonly rule: string;
	readonly mask: string;
	readonly selectorButton: string;

	protected message: string;
	protected value: string;
	protected vue: boolean;
	protected $button: HTMLElement | null;

	constructor(
		selector: HTMLInputElement,
		options: {
			rule?: string;
			message?: string;
			selectorContainer?: string;
			selectorMessage?: string;
			selectorButton?: string;
		} = {},
	) {
		super(selector, options);

		this.vue = false;
		this.rule = options.rule || this.$element.dataset.rule || 'password';
		this.message = options.message || this.$element.dataset.message || 'password';

		this.selectorButton = options.selectorButton || '.js-form-element__button';

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init(): void {
		classInstance.set(this.$element, { formElement: this });

		super.init();

		this.$button = this.$container.querySelector(this.selectorButton);

		this.changeHandler = this.changeHandler.bind(this);
		this.$element.addEventListener('input', this.changeHandler);
		this.$element.addEventListener('change', this.changeHandler);

		this.vueHandler = this.vueHandler.bind(this);
		this.$button?.addEventListener('click', this.vueHandler);
	}

	/**
	 * @desc Удалить обрабочики событий
	 */
	public destroy(): void {
		classInstance.del(this.$element, 'formElement');

		this.$element.removeEventListener('input', this.changeHandler);
		this.$element.removeEventListener('change', this.changeHandler);
		this.$button?.removeEventListener('click', this.vueHandler);
	}

	/**
	 * @desc Переопределить обрабочики событий
	 * @example
	 * const myElement= app.classInstance.get(document.querySelector('input[data-type="password"]'));
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
	 * const myElement = app.classInstance.get(document.querySelector('input[data-type="password"]'));
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

	private vueHandler(): void {
		this.vue = !this.vue;
		this.renderVue(this.vue);
	}

	private renderVue(key: boolean): void {
		this.$element.type = key ? 'text' : 'password';
	}
}
