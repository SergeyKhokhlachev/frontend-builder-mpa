import { classInstance } from '@/shared/helpers/helpers';

import { useElementChange, useElementComplete } from '../composition/elementEvents';
import { useGetValid } from './composition/getValid';

/**
 * @desc UI Компонент FormCheckbox
 * @category 3 Form
 * @example
 * new FormCheckbox(document.querySelector('input[data-type="form-checkbox"]'));
 * @constructor
 * @param {HTMLInputElement} selector - HTMLInputElement формы
 * @param {Object} [options] - опции конфигурации
 * @param {String} [options.selectorContainer=".js-form-element"] - селектор контейнера элемента
 */

export class FormCheckbox {
	readonly $element: HTMLInputElement;
	readonly selectorContainer: string;

	protected value: boolean;
	protected valid: boolean;
	protected error: boolean;

	protected $container: HTMLElement | null;

	constructor(
		selector: HTMLInputElement,
		options: {
			selectorContainer?: string;
		} = {},
	) {
		this.$element = selector;

		if (!this.$element) return;

		this.valid = false;
		this.error = false;

		this.selectorContainer = options.selectorContainer || '.js-form-element';

		this.$container = this.$element.closest(this.selectorContainer);

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init(): void {
		classInstance.set(this.$element, { formElement: this });

		this.changeHandler = this.changeHandler.bind(this);
		this.$element.addEventListener('change', this.changeHandler);
	}

	/**
	 * @desc Удалить обрабочики событий
	 */
	public destroy(): void {
		classInstance.del(this.$element, 'formElement');

		this.$element.removeEventListener('change', this.changeHandler);
	}

	/**
	 * @desc Переопределить обрабочики событий
	 * @example
	 * const myElement= app.classInstance.get(document.querySelector('input[data-type="form-checkbox"]'));
	 * myElement.formElement.reinit();
	 */
	public reinit(): void {
		this.destroy();
		this.init();
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
	}

	/**
	 * @desc Метод валидации элемента
	 * @param {Object} [options] - опции конфигурации
	 * @param {Boolean} [options.noRender=false] - если указать true - представление не будет обновляться при валидации.
	 * @param {Boolean} [options.noEmpty=false] - если указать true - пустое поле не будет валидироваться
	 * @returns {Boolean} результат валидации
	 * @example
	 * const myElement = app.classInstance.get(document.querySelector('input[data-type="form-checkbox"]'));
	 * myElement.formElement.validate();
	 */
	public validate(options: OptionsVE = {}): boolean {
		const optionsValidate: OptionsVE = {
			noRender: options.noRender || false,
			noEmpty: options.noEmpty || false,
		};

		const result: ResultVE = useGetValid(this.$element, optionsValidate);

		if (result.valid && !result.error) useElementComplete(this.$element, { checked: this.value });
		if (!optionsValidate.noRender) {
			this.valid = result.valid;
			this.error = result.error;
			this.render();
		}

		return result.valid;
	}

	private changeHandler(event: InputEvent): void {
		const $target: HTMLInputElement = event.target as HTMLInputElement;
		this.value = $target.checked;
		useElementChange(this.$element, { checked: this.value });
	}
}
