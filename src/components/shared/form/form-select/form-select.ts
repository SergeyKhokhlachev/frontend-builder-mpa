import { classInstance } from '@/common/helpers';
import FormElement from '@/components/shared/form/form-element/form-element';
import { getValidateSelect } from '@/components/shared/form/composition/helpers';
import { dispatchElementValidate, dispatchElementChange } from '@/components/shared/form/composition/events';
import type { ResultValidate, ViewSelectOptions } from '@/components/shared/form/form.types';
/**
 *  UI Компонент FormSelect
 * @category 3 Form
 * @example
 * new FormSelect(document.querySelector('.js-form-select[required]'));
 *
 * @param {HTMLElement} $selector - HTMLInputElement формы
 */

export default class FormSelect extends FormElement {
	readonly $element: HTMLInputElement;
	readonly $wrapper: HTMLElement | null;
	readonly $control: HTMLButtonElement | null = null;
	readonly $result: HTMLElement | null = null;
	readonly $dropdown: HTMLElement | null = null;
	readonly $options: HTMLElement[] = [];
	readonly message: string = 'select';

	protected result: ResultValidate = { valid: false, error: false, complete: false, message: '' };
	protected select: ViewSelectOptions = { id: '', expanded: false, current: -1 };

	constructor($selector: HTMLInputElement) {
		super($selector);

		this.$element = $selector;
		this.$wrapper = this.$element.parentElement;
		if (this.$wrapper) {
			this.$control = this.$wrapper.querySelector('.js-form-select__control');
			this.$result = this.$wrapper.querySelector('.js-form-select__result');
			this.$dropdown = this.$wrapper.querySelector('.js-form-select__dropdown');
			this.$options = Array.from(this.$wrapper.querySelectorAll('.js-form-select__option'));
		}

		this.init();
	}

	/**
	 *  Инициализировать компонент
	 */
	public init() {
		classInstance.set(this.$element, { formElement: this });
		this.$wrapper?.addEventListener('keydown', this.keydownHandler);
		this.$control?.addEventListener('click', this.toggleHandler);
		this.$dropdown?.addEventListener('mouseleave', this.blurHandler);

		this.$options.forEach(($option) => {
			$option.addEventListener('click', this.selectHandler);
			$option.addEventListener('mouseenter', this.highlightHandler);
			if (this.$element.value === $option.dataset.value) {
				if (this.$result) this.$result.textContent = $option.textContent || '';
			}
		});

		document.addEventListener('click', this.outsideHandler);

		this.accessibility();
		this.updateSelectView();
		this.validate(false, true);
	}

	/**
	 *  Удалить обрабочики событий и сбросить состояние
	 */
	public destroy() {
		classInstance.del(this.$element, 'formElement');
		this.$wrapper?.removeEventListener('keydown', this.keydownHandler);
		this.$control?.removeEventListener('click', this.toggleHandler);
		this.$dropdown?.removeEventListener('mouseleave', this.blurHandler);

		this.$options.forEach(($option) => {
			$option.removeEventListener('click', this.selectHandler);
			$option.removeEventListener('mouseenter', this.highlightHandler);
		});

		document.removeEventListener('click', this.outsideHandler);

		this.result = { valid: false, error: false, complete: false, message: '' };
		this.select = { id: '', expanded: false, current: -1 };
	}

	/**
	 *  Переопределить обрабочики событий
	 * @example
	 * const myElement = app.classInstance.get(document.querySelector('.js-form-select[required]'));
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
	 * const myElement = app.classInstance.get(document.querySelector('.js-form-select[required]'));
	 * myElement.formElement.validate();
	 */
	public validate(draw: boolean = true, empty: boolean = false): boolean {
		const checked = this.$options.some((option) => this.$element.value === option.dataset.value);
		this.result = getValidateSelect(this.message, checked, empty, this.$element.required);

		if (draw) this.render(this.result);
		this.$control?.setAttribute('aria-invalid', `${!this.result.valid}`);

		dispatchElementValidate(this.$element, this.result.valid);
		return this.result.valid;
	}

	public accessibility() {
		const elementId = this.$element.id || `form-el-${Math.random().toString(36).substring(2, 11)}`;

		if (!this.$element.id) this.$element.id = elementId;
		this.select.id = elementId;

		if (this.$control) {
			this.$control.id = `${elementId}-trigger`;
			this.$control.setAttribute('aria-haspopup', 'listbox');
			this.$control.setAttribute('aria-expanded', `${this.select.expanded}`);
			this.$control.setAttribute('aria-labelledby', `${elementId}-trigger`);
			this.$control.setAttribute('aria-controls', `${elementId}-dropdown`);
			this.$control.setAttribute('aria-describedby', `${elementId}-error`);
			this.$control.setAttribute('aria-required', `${this.$element.required}`);
		}

		if (this.$dropdown) {
			this.$dropdown.id = `${elementId}-dropdown`;
			this.$dropdown.setAttribute('aria-labelledby', `${elementId}-label`);
			this.$dropdown.setAttribute('aria-activedescendant', '');
		}

		this.$options.forEach(($option, index) => {
			$option.id = `${elementId}-opt-${index}`;
			$option.setAttribute('aria-selected', `${$option.dataset.value === this.$element.value}`);
		});

		super.accessibility(`${elementId}-trigger`, `${elementId}-error`);
	}

	public toggleDropdown(show?: boolean) {
		if (this.$element.disabled) return;

		this.select.expanded = show !== undefined ? show : !this.select.expanded;

		if (this.select.expanded) {
			const selectedIndex = this.$options.findIndex(($option) => $option.dataset.value === this.$element.value);
			this.select.current = selectedIndex !== -1 ? selectedIndex : -1;

			if (selectedIndex !== -1) {
				this.scrollIntoView(selectedIndex);
			}
		} else {
			this.clearOptionFocus();
			if (document.activeElement && this.$dropdown?.contains(document.activeElement)) {
				this.$control?.focus();
			}
		}
		this.updateSelectView();
	}

	private selectOption(target: HTMLElement) {
		this.$element.value = target.dataset.value || '';
		if (this.$result) this.$result.textContent = target.textContent || '';
		this.toggleDropdown(false);
		this.updateSelectView();
		this.validate(true, true);
		dispatchElementChange(this.$element, this.$element.value);
	}

	private scrollIntoView(index: number) {
		const element = this.$options[index];
		if (element) {
			element.scrollIntoView({ block: 'nearest' });
		}
	}

	private clearOptionFocus() {
		this.select.current = -1;
		this.updateSelectView();
	}

	private highlightOption(index: number) {
		this.select.current = index;
		this.updateSelectView();
	}

	private updateSelectView() {
		this.$wrapper?.classList.toggle('active', this.select.expanded);
		this.$control?.setAttribute('aria-expanded', `${this.select.expanded}`);
		this.$control?.classList.toggle('placeholder', !this.$element.value.trim().length);

		const activedescendant = this.select.current >= 0 ? `${this.select.id}-opt-${this.select.current}` : '';
		this.$dropdown?.setAttribute('aria-activedescendant', activedescendant);

		this.$options.forEach(($option, index) => {
			$option.classList.toggle('selected', this.$element.value === $option.dataset.value);
			$option.classList.toggle('focused', index === this.select.current);
		});
	}

	private toggleHandler = () => {
		this.toggleDropdown();
	};

	private blurHandler = () => {
		this.clearOptionFocus();
	};

	private selectHandler = (event: Event) => {
		event.stopPropagation();
		const target = event.target as HTMLElement;
		this.selectOption(target);
	};

	private highlightHandler = (event: Event) => {
		const target = event.target as HTMLElement;
		this.highlightOption(this.$options.indexOf(target));
	};

	private keydownHandler = (event: KeyboardEvent) => {
		if (this.$element.disabled) return;

		const totalOptions = this.$options.length;
		if (totalOptions === 0) return;

		switch (event.key) {
			case 'Enter':
			case ' ':
				event.preventDefault();
				if (this.select.expanded && this.select.current !== -1) {
					this.selectOption(this.$options[this.select.current]);
				} else {
					this.toggleDropdown(true);
				}
				break;

			case 'ArrowDown':
				event.preventDefault();
				if (!this.select.expanded) {
					this.toggleDropdown(true);
				} else {
					this.highlightOption((this.select.current + 1) % totalOptions);
					this.scrollIntoView(this.select.current);
				}
				break;

			case 'ArrowUp':
				event.preventDefault();
				if (!this.select.expanded) {
					this.toggleDropdown(true);
				} else {
					this.highlightOption((this.select.current - 1 + totalOptions) % totalOptions);
					this.scrollIntoView(this.select.current);
				}
				break;

			case 'Escape':
				if (this.select.expanded) {
					event.preventDefault();
					this.toggleDropdown(false);
					this.$control?.focus();
				}
				break;

			case 'Tab':
				if (this.select.expanded) {
					this.toggleDropdown(false);
				}
				break;

			case 'Home':
				if (this.select.expanded) {
					event.preventDefault();
					this.highlightOption(0);
					this.scrollIntoView(this.select.current);
				}
				break;

			case 'End':
				if (this.select.expanded) {
					event.preventDefault();
					this.highlightOption(totalOptions - 1);
					this.scrollIntoView(this.select.current);
				}
				break;
		}
	};

	private outsideHandler = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		if (!this.$wrapper || !this.select.expanded) return;
		if (!this.$wrapper.contains(target)) this.toggleDropdown(false);
	};
}
