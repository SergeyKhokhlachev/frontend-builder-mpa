import { classInstance } from '@/common/helpers';
import FormElement from '@/components/shared/form/form-element/form-element';
import { getValidateInput } from '@/components/shared/form/composition/helpers';
import { getFormatPhone } from '@/components/shared/form/composition/formatting';
import { dispatchElementValidate, dispatchElementChange } from '@/components/shared/form/composition/events';
import type { ResultValidate } from '@/components/shared/form/form.types';
/**
 *  UI Компонент FormInput
 * @category 3 Form
 * @example
 * new FormInput(document.querySelector('input[required]'));
 *
 * @param {HTMLElement} $selector - HTMLInputElement формы
 */

export default class FormInput extends FormElement {
	readonly $element: HTMLInputElement;
	readonly rule: string;
	readonly message: string;
	readonly type: string;

	protected result: ResultValidate = { valid: false, error: false, complete: false, message: '' };

	constructor($selector: HTMLInputElement) {
		super($selector);

		this.$element = $selector;

		this.rule = $selector.dataset.rule || $selector.type || 'text';
		this.message = $selector.dataset.message || $selector.type || 'text';
		this.type = this.$element.type;

		this.init();
	}

	/**
	 *  Инициализировать компонент
	 */
	public init() {
		classInstance.set(this.$element, { formElement: this });
		this.$element.addEventListener('input', this.inputHandler);
		this.$element.addEventListener('focus', this.focusHandler);
		this.$element.addEventListener('blur', this.blurHandler);
		if (this.$showIcon) this.$showIcon.addEventListener('click', this.toggleHandler);

		this.accessibility();
		this.validate(false, true);
	}

	/**
	 *  Удалить обрабочики событий и сбросить состояние
	 */
	public destroy() {
		classInstance.del(this.$element, 'formElement');
		this.$element.removeEventListener('input', this.inputHandler);
		this.$element.removeEventListener('focus', this.focusHandler);
		this.$element.removeEventListener('blur', this.blurHandler);
		if (this.$showIcon) this.$showIcon.removeEventListener('click', this.toggleHandler);
		this.result = { valid: false, error: false, complete: false, message: '' };
	}

	/**
	 *  Переопределить обрабочики событий
	 * @example
	 * const myElement = app.classInstance.get(document.querySelector('input[required]'));
	 * myElement.formElement.reinit();
	 */
	public reinit() {
		this.destroy();
		this.init();
	}

	/**
	 *  Метод валидации элемента
	 * @param {Boolean} [draw=true] - если указать false - представление не будет обновляться при валидации.
	 * @param {Boolean} [empty=false] - если указать true - пустое поле не будет выводить ошибку, но останеться не валидным.
	 * @returns {Boolean} результат валидации
	 * @example
	 * const myElement = app.classInstance.get(document.querySelector('input[required]'));
	 * myElement.formElement.validate();
	 */
	public validate(draw: boolean = true, empty: boolean = false): boolean {
		this.result = getValidateInput(this.rule, this.message, this.$element.value, empty, this.$element.required);

		if (draw) this.render(this.result);
		this.$element.setAttribute('aria-invalid', `${!this.result.valid}`);

		dispatchElementValidate(this.$element, this.result.valid);
		return this.result.valid;
	}

	public accessibility() {
		const elementId = this.$element.id || `form-el-${Math.random().toString(36).substring(2, 11)}`;

		if (!this.$element.id) this.$element.id = elementId;

		const errorId = `${elementId}-error`;

		this.$element.setAttribute('aria-required', `${this.$element.required}`);
		this.$element.setAttribute('aria-describedby', errorId);
		super.accessibility(elementId, errorId);
	}

	public toggle() {
		if (this.$showIcon) {
			this.$showIcon.classList.toggle('shown');
			this.$element.type = this.$showIcon.classList.contains('shown') ? 'text' : this.type;
		}
	}

	private inputHandler = (event: Event) => {
		const target = event.target as HTMLInputElement;

		if (this.$element.type === 'tel') {
			this.$element.value = getFormatPhone(target.value);
		}

		this.validate(true, true);
		dispatchElementChange(this.$element, this.$element.value);
	};

	private focusHandler = () => {
		this.focus(this.result, true);
	};

	private blurHandler = () => {
		this.focus(this.result, false);
	};

	private toggleHandler = () => {
		this.toggle();
	};
}
