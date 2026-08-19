import type { ResultValidate } from '@/components/shared/form/form.types';
/**
 *  UI Компонент FormElement
 * @category 3 Form
 *
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

	public accessibility(elementId: string, errorId: string, id: string | null = null) {
		if (this.$label) {
			this.$label.setAttribute('for', elementId);
			if (id) this.$label.setAttribute('id', id);
		}
		if (this.$message) {
			this.$message.setAttribute('id', errorId);
			this.$message.setAttribute('aria-live', 'polite');
			this.$message.setAttribute('aria-atomic', 'true');
		}
	}

	public render(result: ResultValidate) {
		this.$container?.classList.toggle('valid', result.complete);
		this.$container?.classList.toggle('error', result.error);
		if (this.$message) {
			this.$message.innerText = result.message || '';
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
