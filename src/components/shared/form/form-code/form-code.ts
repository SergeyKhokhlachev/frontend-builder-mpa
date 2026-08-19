import { classInstance } from '@/common/helpers';
import FormElement from '@/components/shared/form/form-element/form-element';
import { getValidateCode } from '@/components/shared/form/common/validate';
import { dispatchElementValidate, dispatchElementChange } from '@/components/shared/form/common/events';
import type { ResultValidate } from '@/components/shared/form/form.types';
/**
 *  UI Компонент FormCode
 * @category 3 Form
 * @example
 * new FormCode(document.querySelector('.js-form-code[required]'));
 *
 * @param {HTMLElement} $selector - HTMLInputElement формы
 */
export default class FormCode extends FormElement {
	readonly $element: HTMLInputElement;
	readonly $wrapper: HTMLElement | null;
	readonly $group: HTMLElement | null = null;
	readonly $digits: HTMLInputElement[] = []; // Изменено на HTMLInputElement для типизации value
	readonly message: string = 'code';

	protected result: ResultValidate = { valid: false, error: false, complete: false, message: '' };

	constructor($selector: HTMLInputElement) {
		super($selector);

		this.$element = $selector;
		this.$wrapper = this.$element.parentElement;

		if (this.$wrapper) {
			this.$group = this.$wrapper.querySelector('.js-form-code__group');
			this.$digits = Array.from(this.$wrapper.querySelectorAll<HTMLInputElement>('.js-form-code__element'));
		}

		this.init();
	}

	/**
	 *  Инициализировать компонент
	 */
	public init() {
		classInstance.set(this.$element, { formElement: this });
		this.$digits.forEach(($digit) => {
			$digit.addEventListener('input', this.inputHandler);
			$digit.addEventListener('keydown', this.keydownHandler);
			$digit.addEventListener('paste', this.pasteHandler);
		});
		this.accessibility();
		this.validate(false, true);
	}

	/**
	 *  Удалить обрабочики событий и сбросить состояние
	 */
	public destroy() {
		classInstance.del(this.$element, 'formElement');
		this.$digits.forEach(($digit) => {
			$digit.removeEventListener('input', this.inputHandler);
			$digit.removeEventListener('keydown', this.keydownHandler);
			$digit.removeEventListener('paste', this.pasteHandler);
		});
		this.result = { valid: false, error: false, complete: false, message: '' };
	}

	/**
	 *  Переопределить обрабочики событий
	 * @example
	 * const myElement = app.classInstance.get(document.querySelector('.js-form-code[required]'));
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
	 * const myElement = app.classInstance.get(document.querySelector('.js-form-code[required]'));
	 * myElement.formElement.validate();
	 */
	public validate(draw: boolean = true, empty: boolean = false): boolean {
		this.result = getValidateCode(this.message, this.$element.value, empty, this.$element.required, this.$digits.length);

		if (draw) this.render(this.result);
		this.$digits.forEach(($digit) => $digit.setAttribute('aria-invalid', `${!this.result.valid}`));

		dispatchElementValidate(this.$element, this.result.valid);
		return this.result.valid;
	}

	public accessibility() {
		const elementId = this.$element.id || `form-el-${Math.random().toString(36).substring(2, 11)}`;
		if (!this.$element.id) this.$element.id = elementId;

		const errorId = `${elementId}-error`;

		this.$digits.forEach(($digit, index) => {
			$digit.id = `${elementId}-digit-${index + 1}`;
			$digit.setAttribute('aria-describedby', errorId);
			$digit.setAttribute('aria-required', `${this.$element.required}`);
			$digit.setAttribute('aria-label', `Цифра кода ${index + 1}`);
		});

		if (this.$group) this.$group.setAttribute('aria-labelledby', `${elementId}-label`);

		super.accessibility(`${elementId}-digit-1`, errorId, `${elementId}-label`);
	}

	private updateCodeValue(newValue: string) {
		const cleanValue = newValue.replace(/\D/g, '').slice(0, this.$digits.length);
		this.$element.value = cleanValue;

		this.$digits.forEach(($digit, idx) => {
			$digit.value = cleanValue[idx] || '';
		});

		this.validate(true, true);
		dispatchElementChange(this.$element, cleanValue);
	}

	private inputCode(target: HTMLInputElement, index: number) {
		if (!/^\d+$/.test(target.value)) {
			target.value = '';
			return;
		}

		const newCode = [...this.$element.value];
		newCode[index] = target.value.slice(-1);
		this.updateCodeValue(newCode.join(''));
		if (target.value && index < this.$digits.length - 1) this.$digits[index + 1]?.focus();
	}

	private keydownCode(event: KeyboardEvent, index: number) {
		if (event.key === 'Backspace') {
			event.preventDefault();
			const newCode = [...this.$element.value];

			if (this.$digits[index].value) {
				newCode[index] = '';
				this.updateCodeValue(newCode.join(''));
			} else if (index > 0) {
				newCode[index - 1] = '';
				this.updateCodeValue(newCode.join(''));
				this.$digits[index - 1]?.focus();
			}
		} else if (event.key === 'ArrowLeft' && index > 0) {
			event.preventDefault();
			this.$digits[index - 1]?.focus();
		} else if (event.key === 'ArrowRight' && index < this.$digits.length - 1) {
			event.preventDefault();
			this.$digits[index + 1]?.focus();
		}
	}

	private pasteCode(pasted: string) {
		const digits = pasted.replace(/\D/g, '').slice(0, this.$digits.length);
		if (!digits) return;

		this.updateCodeValue(digits);
		const targetIndex = Math.min(digits.length, this.$digits.length - 1);
		this.$digits[targetIndex]?.focus();
	}

	private inputHandler = (event: Event) => {
		const target = event.target as HTMLInputElement;
		this.inputCode(target, this.$digits.indexOf(target));
	};

	private keydownHandler = (event: KeyboardEvent) => {
		const target = event.target as HTMLInputElement;
		this.keydownCode(event, this.$digits.indexOf(target));
	};

	private pasteHandler = (event: ClipboardEvent) => {
		event.preventDefault();
		this.pasteCode(event.clipboardData?.getData('text') || '');
	};
}
