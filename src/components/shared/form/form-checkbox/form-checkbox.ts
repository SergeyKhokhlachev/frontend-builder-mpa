import { classInstance } from '@/common/helpers';
import { getValidateBox } from '@/components/shared/form/composition/helpers';
import { dispatchElementValidate, dispatchElementChange } from '@/components/shared/form/composition/events';
import type { ResultValidate } from '@/components/shared/form/form.types';
/**
 * @desc UI Компонент FormCheckbox
 * @category 3 Form
 * @example
 * new FormCheckbox(document.querySelector('input[type="checkbox"]'));
 * @constructor
 * @param {HTMLElement} $selector - HTMLInputElement формы
 */

export default class FormCheckbox {
	readonly $element: HTMLInputElement;
	readonly $container: HTMLElement | null;
	readonly $label: HTMLLabelElement | null = null;

	protected result: ResultValidate = { valid: false, error: false, complete: false };

	constructor($selector: HTMLInputElement) {
		this.$element = $selector;
		this.$container = $selector.closest('.js-form-element');
		if (this.$container) this.$label = this.$container.querySelector('label');

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init() {
		classInstance.set(this.$element, { formElement: this });
		this.$element?.addEventListener('change', this.changeHandler);

		this.accessibility();
		this.validate(false, true);
	}

	/**
	 * @desc Удалить обрабочики событий и сбросить состояние
	 */
	public destroy() {
		classInstance.del(this.$element, 'formElement');
		this.$element?.removeEventListener('change', this.changeHandler);
		this.result = { valid: false, error: false, complete: false };
	}

	/**
	 * @desc Переопределить обрабочики событий
	 * @example
	 * const myElement = app.classInstance.get(document.querySelector('input[type="checkbox"]'));
	 * myElement.formElement.reinit();
	 */
	public reinit() {
		this.destroy();
		this.init();
	}

	/**
	 * @desc Метод валидации элемента
	 * @param {Boolean} [draw=true] - если указать false - представление не будет обновляться при валидации.
	 * @param {Boolean} [empty=false] - если указать true - пустое поле не будет выводить ошибку, но останеться не валидным.
	 * @returns {Boolean} результат валидации
	 * @example
	 * const myElement = app.classInstance.get(document.querySelector('input[type="checkbox"]'));
	 * myElement.formElement.validate();
	 */
	public validate(draw: boolean = true, empty: boolean = false): boolean {
		this.result = getValidateBox(this.$element.checked, empty, this.$element.required);

		if (draw) this.render(this.result);
		this.$element.setAttribute('aria-invalid', `${!this.result.valid}`);

		dispatchElementValidate(this.$element, this.result.valid);
		return this.result.valid;
	}

	public accessibility() {
		const elementId = this.$element.id || `form-el-${Math.random().toString(36).substring(2, 11)}`;
		if (!this.$element.id) this.$element.id = elementId;

		this.$element.setAttribute('aria-required', `${this.$element.required}`);
		if (this.$label) this.$label.setAttribute('for', elementId);
	}

	public render(result: ResultValidate) {
		this.$container?.classList.toggle('valid', result.complete);
		this.$container?.classList.toggle('error', result.error);
	}

	private changeHandler = () => {
		this.validate(true, true);
		dispatchElementChange(this.$element, this.$element.checked);
	};
}
