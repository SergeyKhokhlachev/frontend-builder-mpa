import { classInstance } from '@/shared/helpers/helpers';

import { FormElement } from '../form-element';

import { useElementChange, useElementComplete } from '../composition/elementEvents';
import { useGetValid } from './composition/getValid';
import { useGetValue } from './composition/getValue';
import { useGetCode } from './composition/getCode';
import { useCheckDigit } from './composition/checkDigit';
import { useSetTarget } from './composition/setTarget';

/**
 * @desc UI Компонент FormCode
 * @category 3 Form
 * @example
 * new FormInput(document.querySelector('input[data-type="form-code"]'));
 * @constructor
 * @param {HTMLInputElement} selector - HTMLInputElement формы
 * @param {Object} [options] - опции конфигурации
 * @param {String} [options.message="code"] - имя правила для вывода сообщений об ошибке, если не указанно - береться значение attr data-message
 * @param {String} [options.selectorСodeContainer=".js-form-code"] - селектор контейнера поля
 * @param {String} [options.selectorСodeElement=".js-form-code__element"] - селектор элементов ввода
 */

export class FormCode extends FormElement {
	readonly $element: HTMLInputElement;
	readonly selectorСodeContainer: string;
	readonly selectorСodeElement: string;

	protected message: string;
	protected value: string;
	protected $codeContainer: HTMLElement | null;
	protected $codeElements: NodeListOf<HTMLInputElement>;

	constructor(
		selector: HTMLInputElement,
		options: {
			message?: string;
			selectorContainer?: string;
			selectorMessage?: string;
			selectorСodeContainer?: string;
			selectorСodeElement?: string;
		} = {},
	) {
		super(selector, options);

		this.message = options.message || this.$element.dataset.message || 'code';
		this.selectorСodeContainer = options.selectorСodeContainer || '.js-form-code';
		this.selectorСodeElement = options.selectorСodeElement || '.js-form-code__element';

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init(): void {
		classInstance.set(this.$element, { formElement: this });

		super.init();

		this.$codeContainer = this.$element.closest(this.selectorСodeContainer);
		this.$codeElements = this.$codeContainer.querySelectorAll(this.selectorСodeElement);

		this.pasteHandler = this.pasteHandler.bind(this);
		this.keydownHandler = this.keydownHandler.bind(this);
		this.changeHandler = this.changeHandler.bind(this);
		this.$codeElements.forEach((element) => {
			element.addEventListener('paste', this.pasteHandler);
			element.addEventListener('keydown', this.keydownHandler);
			element.addEventListener('input', this.changeHandler);
			element.addEventListener('change', this.changeHandler);
		});
	}

	/**
	 * @desc Удалить обрабочики событий
	 */
	public destroy(): void {
		classInstance.del(this.$element, 'formElement');

		this.$codeElements.forEach((element) => {
			element.removeEventListener('paste', this.pasteHandler);
			element.removeEventListener('keydown', this.keydownHandler);
			element.removeEventListener('input', this.changeHandler);
			element.removeEventListener('change', this.changeHandler);
		});
	}

	/**
	 * @desc Переопределить обрабочики событий
	 * @example
	 * const myElement= app.classInstance.get(document.querySelector('input[data-type="form-code"]'));
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
	 * @param {String} [options.message] - имя правила для вывода сообщений об ошибке
	 * @returns {Boolean} результат валидации
	 * @example
	 * const myElement = app.classInstance.get(document.querySelector('input[data-type="form-code"]'));
	 * myElement.formElement.validate();
	 */
	public validate(options: OptionsVE = {}): boolean {
		const optionsValidate: OptionsVE = {
			noRender: options.noRender || false,
			noEmpty: options.noEmpty || false,
			message: options.message || this.message,
		};

		const result: ResultVE = useGetValid(
			this.$element,
			this.$codeElements.length,
			optionsValidate,
		);

		if (result.message) this.messageComputed = result.message;
		if (result.valid && !result.error) useElementComplete(this.$element, { value: this.value });
		if (!optionsValidate.noRender) {
			this.valid = result.valid;
			this.error = result.error;
			this.render();
		}

		return result.valid;
	}

	private keydownHandler(event: KeyboardEvent): void {
		const $target: HTMLInputElement = event.target as HTMLInputElement;
		const code = useGetCode(event);

		switch (code) {
			case 'Space':
				useSetTarget(Array.from(this.$codeElements), $target, 1);
				break;

			case 'Backspace':
				if ($target.value) {
					$target.value = '';
					this.updateValue();
				} else {
					useSetTarget(Array.from(this.$codeElements), $target, -1);
				}
				break;

			case 'ArrowRight':
				useSetTarget(Array.from(this.$codeElements), $target, 1);
				break;

			case 'ArrowLeft':
				useSetTarget(Array.from(this.$codeElements), $target, -1);
				break;

			case 'Digit':
				$target.value = event.key;
				this.updateValue();
				useSetTarget(Array.from(this.$codeElements), $target, 1);
				break;

			default:
				break;
		}
	}

	private pasteHandler(event: ClipboardEvent): void {
		event.preventDefault();
		this.updateVue(event.clipboardData.getData('text'));
		this.updateValue();
	}

	private changeHandler(event: InputEvent): void {
		const $target: HTMLInputElement = event.target as HTMLInputElement;
		if (useCheckDigit($target.value)) {
			this.updateValue();
		} else {
			$target.value = '';
		}
	}

	private updateValue(): void {
		this.value = useGetValue(this.$codeElements);
		this.$element.value = this.value;
		setTimeout(() => useElementChange(this.$element, { value: this.value }));
	}

	private updateVue(value: string): void {
		this.$codeElements.forEach((element: HTMLInputElement, index: number) => {
			if (value[index]) {
				if (useCheckDigit(value[index])) element.value = value[index];
				element.focus();
			}
		});
	}
}
