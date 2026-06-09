import { classInstance } from '@/shared/helpers/helpers';

import { FormObserver } from './composition/observer';
import { useValidate } from './composition/validate';

import { FormInput } from './form-element/form-input/form-input';
import { FormPassword } from './form-element/form-input/form-password';
import { FormSelect } from './form-element/form-select/form-select';
import { FormComplete } from './form-element/form-complete/form-complete';
import { FormTextArea } from './form-element/form-textarea/form-textarea';
import { FormCheckbox } from './form-element/form-checkbox/form-checkbox';
import { FormFile } from './form-element/form-file/form-file';
import { FormCode } from './form-element/form-code/form-code';

/**
 * @desc UI Компонент Form
 * @category 3 Form
 * @example
 * document.querySelectorAll('.js-form').forEach((element) => {new Form(element)});
 * @constructor
 * @param {HTMLFormElement} selector - HTMLFormElement
 */

export class Form {
	readonly $form: HTMLFormElement;

	public formValid: boolean;
	protected formObserver: any;
	protected $buttons: Array<HTMLButtonElement>;

	constructor(selector: HTMLFormElement) {
		this.$form = selector;

		if (!this.$form) return;

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	async init() {
		classInstance.set(this.$form, { form: this });

		this.$buttons = Array.from(this.$form.querySelectorAll('[type="submit"]'));

		this.formObserver = new FormObserver(this.$form);
		this.$form.querySelectorAll('input[required]').forEach(($element: HTMLInputElement) => {
			const type = $element.dataset.type;
			switch (type) {
				case 'form-code':
					new FormCode($element);
					break;

				case 'form-file':
					new FormFile($element);
					break;

				case 'form-checkbox':
					new FormCheckbox($element);
					break;

				case 'form-complete':
					new FormComplete($element);
					break;

				case 'form-password':
					new FormPassword($element);
					break;

				default:
					new FormInput($element);
					break;
			}
		});
		this.$form.querySelectorAll('select[required]').forEach(($element: HTMLSelectElement) => {
			new FormSelect($element);
		});
		this.$form.querySelectorAll('textarea[required]').forEach(($element: HTMLTextAreaElement) => {
			new FormTextArea($element);
		});

		this.checkHandler = this.checkHandler.bind(this);
		this.$form.addEventListener('formChange', this.checkHandler);

		this.formCheck(true);
	}

	/**
	 * @desc Удалить обрабочики событий
	 */
	public destroy(): void {
		classInstance.del(this.$form, 'form');
		this.formObserver.destroy();
		this.$form.removeEventListener('formChange', this.checkHandler);
	}

	/**
	 * @desc Переопределить обрабочики событий
	 * @example
	 * const myForm = app.classInstance.get(document.querySelector('.js-form'));
	 * myForm.form.reinit();
	 */
	public reinit(): void {
		this.destroy();
		this.init();
	}

	/**
	 * @desc Проверить валидность формы
	 * @param {Boolean} [noRender=false] - если указать true - представление не будет обновляться при валидации.
	 * @returns {Boolean} результат валидации
	 * @example
	 * const myForm = app.classInstance.get(document.querySelector('.js-form'));
	 * myForm.form.formCheck();
	 */
	public formCheck(noRender?: boolean): boolean {
		const result: ResultVF = useValidate(this.$form, noRender);

		this.formValid = result.valid;
		this.render(result.looked);

		return result.valid;
	}

	private checkHandler(event: CustomEvent) {
		this.render(event.detail.looked);
	}

	private render(looked: boolean): void {
		this.$buttons.forEach((button) => (button.disabled = looked));
	}
}
