import type { ResultValidate } from '@/components/shared/form/form.types';
/**
 * @desc UI Компонент FormElement
 * @category 3 Form
 * @constructor
 * @param {HTMLElement} $selector - HTMLElement формы
 */

export default class FormElement {
	readonly $container: HTMLElement | null;
	readonly $label: HTMLLabelElement | null = null;
	readonly $message: HTMLElement | null = null;
	readonly $showIcon: HTMLElement | null = null;

	constructor($selector: HTMLElement) {
		this.$container = $selector.closest('.js-form-element');
		if (this.$container) {
			this.$label = this.$container.querySelector('label');
			this.$message = this.$container.querySelector('.js-form-element__message');
			this.$showIcon = this.$container.querySelector('.js-form-element__shown');
		}
	}

	public accessibility(elementId: string, errorId: string) {
		if (this.$label) this.$label.setAttribute('for', elementId);
		if (this.$message) {
			this.$message.setAttribute('id', errorId);
			this.$message.setAttribute('aria-live', 'off');
			this.$message.setAttribute('aria-atomic', 'true');
		}
	}

	public render(result: ResultValidate) {
		this.$container?.classList.toggle('valid', result.complete);
		this.$container?.classList.toggle('error', result.error);
		if (this.$message) {
			this.$message.innerText = result.message || '';
			this.$message.setAttribute('aria-live', result.error ? 'assertive' : 'off');
		}
	}

	public focus(result: ResultValidate, key: boolean) {
		if (key && !result.error) {
			this.$container?.classList.add('focus');
		} else {
			this.$container?.classList.remove('focus');
		}
	}
}
