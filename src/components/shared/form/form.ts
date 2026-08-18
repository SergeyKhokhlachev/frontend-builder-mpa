import { classInstance } from '@/common/helpers';

import FormCheckbox from '@/components/shared/form/form-checkbox/form-checkbox';
import FormCode from '@/components/shared/form/form-code/form-code';
import FormFile from '@/components/shared/form/form-file/form-file';
import FormInput from '@/components/shared/form/form-input/form-input';
import FormRadio from '@/components/shared/form/form-radio/form-radio';
import FormSelect from '@/components/shared/form/form-select/form-select';
import FormTextarea from '@/components/shared/form/form-textarea/form-textarea';
import { dispatchFormChange } from '@/components/shared/form/composition/events';
import type { FormComponent, ElementValidateEvent } from '@/components/shared/form/form.types';

/**
 * @desc UI Компонент Form
 * @category 3 Form
 * @example
 * document.querySelectorAll('.js-form').forEach((element) => {new Form(element)});
 * @constructor
 * @param {HTMLFormElement} selector - HTMLFormElement
 */

const COMPONENT_FACTORIES = [
	{ selector: '.js-form-input', create: (el: HTMLElement) => new FormInput(el as HTMLInputElement) },
	{ selector: '.js-form-textarea', create: (el: HTMLElement) => new FormTextarea(el as HTMLTextAreaElement) },
	{ selector: '.js-form-checkbox', create: (el: HTMLElement) => new FormCheckbox(el as HTMLInputElement) },
	{ selector: '.js-form-radio', create: (el: HTMLElement) => new FormRadio(el as HTMLFieldSetElement) },
	{ selector: '.js-form-file', create: (el: HTMLElement) => new FormFile(el as HTMLInputElement) },
	{ selector: '.js-form-select', create: (el: HTMLElement) => new FormSelect(el as HTMLInputElement) },
	{ selector: '.js-form-code', create: (el: HTMLElement) => new FormCode(el as HTMLInputElement) },
];
const FORM_SELECTORS = COMPONENT_FACTORIES.map((f) => f.selector).join(', ');

export default class Form {
	readonly $form: HTMLFormElement;

	protected instances: Array<FormComponent> = [];
	protected cache: Map<EventTarget, boolean> = new Map();

	constructor(selector: HTMLFormElement) {
		this.$form = selector;
		if (!this.$form) return;

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	init() {
		classInstance.set(this.$form, { form: this });

		this.$form.addEventListener('elementValidate', this.validateHandler);

		this.$form.querySelectorAll<HTMLElement>(FORM_SELECTORS).forEach(($el) => {
			const factory = COMPONENT_FACTORIES.find((f) => $el.matches(f.selector));
			if (factory) this.instances.push(factory.create($el));
		});
	}

	/**
	 * @desc Удалить обрабочики событий и сбросить состояние
	 */
	public destroy() {
		classInstance.del(this.$form, 'form');
		this.$form.removeEventListener('elementValidate', this.validateHandler);
		this.instances.forEach((instance) => {
			if (typeof instance.destroy === 'function') instance.destroy();
		});

		this.instances = [];
		this.cache.clear();
	}

	/**
	 * @desc Переопределить обрабочики событий
	 * @example
	 * const myForm = app.classInstance.get(document.querySelector('.js-form'));
	 * myForm.form.reinit();
	 */
	public reinit() {
		this.destroy();
		this.init();
	}

	/**
	 * @desc Проверить валидность формы
	 * @param {Boolean} [draw=true] - если указать false - представление не будет обновляться при валидации.
	 * @returns {Boolean} результат валидации
	 * @example
	 * const myForm = app.classInstance.get(document.querySelector('.js-form'));
	 * myForm.form.formCheck();
	 */
	public checkForm(draw: boolean = true): boolean {
		let valid = true;
		this.instances.forEach((instance) => {
			if (!instance.validate(draw)) valid = false;
		});
		return valid;
	}

	private updateStatus() {
		const valid = !Array.from(this.cache.values()).includes(false);
		dispatchFormChange(this.$form, valid);
	}

	private validateHandler = (event: ElementValidateEvent) => {
		const target = event.target as HTMLElement;
		if (target) this.cache.set(target, event.detail.valid);
		this.updateStatus();
	};
}
