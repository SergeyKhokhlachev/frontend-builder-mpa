import { classInstance } from '@/common/helpers';
import { getValidateBox } from '@/components/shared/form/composition/helpers';
import { dispatchElementValidate, dispatchElementChange } from '@/components/shared/form/composition/events';
import type { ResultValidate } from '@/components/shared/form/form.types';
/**
 * @desc UI Компонент FormRadio
 * @category 3 Form
 * @example
 * new FormRadio(document.querySelector('fieldset.js-form-radio'));
 * @constructor
 * @param {HTMLElement} $selector - HTMLElement кнотейнер группы fieldset
 */

export default class FormRadio {
	readonly $element: HTMLFieldSetElement;
	readonly $items: HTMLInputElement[];

	protected result: ResultValidate = { valid: false, error: false, complete: false };

	constructor($selector: HTMLFieldSetElement) {
		this.$element = $selector;
		this.$items = Array.from(this.$element.querySelectorAll('input[type="radio"]'));

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init() {
		classInstance.set(this.$element, { formElement: this });
		this.$items.forEach(($element) => $element.addEventListener('input', this.changeHandler));

		this.accessibility();
		this.validate(false, true);
	}

	/**
	 * @desc Удалить обрабочики событий и сбросить состояние
	 */
	public destroy() {
		classInstance.del(this.$element, 'formElement');
		this.$items.forEach(($element) => $element.removeEventListener('input', this.changeHandler));
		this.result = { valid: false, error: false, complete: false };
	}

	/**
	 * @desc Переопределить обрабочики событий
	 * @example
	 * const myElement = app.classInstance.get(document.querySelector('fieldset.js-form-radio'));
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
	 * const myElement = app.classInstance.get(document.querySelector('fieldset.js-form-radio'));
	 * myElement.formElement.validate();
	 */
	public validate(draw: boolean = true, empty: boolean = false): boolean {
		const checked = this.$items.some(($element) => $element.checked);
		const required = this.$items.some(($element) => $element.required);
		this.result = getValidateBox(checked, empty, required);

		if (draw) this.render(this.result);
		this.$element.setAttribute('aria-invalid', `${!this.result.valid}`);

		dispatchElementValidate(this.$element, this.result.valid);
		return this.result.valid;
	}

	public accessibility() {
		const required = this.$items.some(($element) => $element.required);
		this.$element.setAttribute('aria-required', `${required}`);
		this.$element.setAttribute('aria-invalid', `${required}`);
	}

	public render(result: ResultValidate) {
		this.$element?.classList.toggle('valid', result.complete);
		this.$element?.classList.toggle('error', result.error);
	}

	private changeHandler = () => {
		this.validate(true, true);
		dispatchElementChange(
			this.$element,
			this.$items.some(($element) => $element.checked),
		);
	};
}
