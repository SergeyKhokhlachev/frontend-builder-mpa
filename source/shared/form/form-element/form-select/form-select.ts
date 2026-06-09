import { classInstance, clickOutside } from '@/shared/helpers/helpers';
import { Scrollbar } from '@/shared/common/scrollbar/scrollbar';

import { FormElement } from '../form-element';

import { useElementChange, useElementComplete } from '../composition/elementEvents';
import { useGetValid } from './composition/getValid';

/**
 * @desc UI Компонент FormSelect
 * @category 3 Form
 * @example
 * new FormSelect(document.querySelector('select[required]'));
 * @constructor
 * @param {HTMLSelectElement} selector - HTMLSelectElement формы
 * @param {Object} [options] - опции конфигурации
 * @param {String} [options.message="select"] - имя правила для вывода сообщений об ошибке, если не указанно - береться значение attr data-message
 * @param {String} [options.selectorSelectContainer=".js-form-select"] - селектор контейнера поля
 * @param {String} [options.selectorSelectControl=".js-form-select__control"] - селектор блока результатов
 * @param {String} [options.selectorSelectResult=".js-form-select__result"] - селектор вывода выбраного значения
 * @param {String} [options.selectorSelectDropdown=".js-form-select__dropdown"] - селектор выподающего блока
 * @param {String} [options.selectorSelectScroll=".js-form-select__scrollbar"] - селектор скроллбара
 * @param {String} [options.selectorSelectOptions=".js-form-select__options"] - селектор списка значений
 */

export class FormSelect extends FormElement {
	readonly $element: HTMLSelectElement;
	readonly selectorSelectContainer: string;
	readonly selectorSelectControl: string;
	readonly selectorSelectResult: string;
	readonly selectorSelectDropdown: string;
	readonly selectorSelectScroll: string;
	readonly selectorSelectOptions: string;

	protected message: string;
	protected value: string;
	protected scrollbar: InstanceType<typeof Scrollbar>;
	protected $selectContainer: HTMLElement | null;
	protected $selectControl: HTMLElement | null;
	protected $selectResult: HTMLElement | null;
	protected $selectDropdown: HTMLElement | null;
	protected $selectScroll: HTMLElement | null;
	protected $selectOptions: HTMLElement | null;

	constructor(
		selector: HTMLSelectElement,
		options: {
			message?: string;
			selectorContainer?: string;
			selectorMessage?: string;
			selectorSelectContainer?: string;
			selectorSelectControl?: string;
			selectorSelectResult?: string;
			selectorSelectDropdown?: string;
			selectorSelectScroll?: string;
			selectorSelectOptions?: string;
		} = {},
	) {
		super(selector, options);

		this.message = options.message || this.$element.dataset.message || 'select';
		this.selectorSelectContainer = options.selectorSelectContainer || '.js-form-select';
		this.selectorSelectControl = options.selectorSelectControl || '.js-form-select__control';
		this.selectorSelectResult = options.selectorSelectResult || '.js-form-select__result';
		this.selectorSelectDropdown = options.selectorSelectDropdown || '.js-form-select__dropdown';
		this.selectorSelectScroll = options.selectorSelectScroll || '.js-form-select__scrollbar';
		this.selectorSelectOptions = options.selectorSelectOptions || '.js-form-select__options';

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init(): void {
		classInstance.set(this.$element, { formElement: this });

		super.init();

		this.$selectContainer = this.$element.closest(this.selectorSelectContainer);
		this.$selectControl = this.$selectContainer.querySelector(this.selectorSelectControl);
		this.$selectResult = this.$selectContainer.querySelector(this.selectorSelectResult);
		this.$selectDropdown = this.$selectContainer.querySelector(this.selectorSelectDropdown);
		this.$selectScroll = this.$selectContainer.querySelector(this.selectorSelectScroll);
		this.$selectOptions = this.$selectContainer.querySelector(this.selectorSelectOptions);

		this.renderResult();
		this.renderOptions();

		if (this.$selectScroll) this.scrollbar = new Scrollbar(this.$selectScroll);

		this.outsideHandler = this.outsideHandler.bind(this);
		document.addEventListener('click', this.outsideHandler);

		this.toggleHandler = this.toggleHandler.bind(this);
		this.$selectControl?.addEventListener('click', this.toggleHandler);

		this.selectHandler = this.selectHandler.bind(this);
		this.$selectOptions?.addEventListener('click', this.selectHandler);

		this.removeHandler = this.removeHandler.bind(this);
		this.$selectResult?.addEventListener('click', this.removeHandler);
	}

	/**
	 * @desc Удалить обрабочики событий
	 */
	public destroy(): void {
		classInstance.del(this.$element, 'formElement');

		this.scrollbar.destroy();
		document.removeEventListener('click', this.outsideHandler);
		this.$selectControl?.removeEventListener('click', this.toggleHandler);
		this.$selectOptions?.removeEventListener('click', this.selectHandler);
		this.$selectResult?.removeEventListener('click', this.removeHandler);
	}

	/**
	 * @desc Переопределить обрабочики событий
	 * @example
	 * const myElement= app.classInstance.get(document.querySelector('select[required]'));
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
	 * const myElement = app.classInstance.get(document.querySelector('select[required]'));
	 * myElement.formElement.validate();
	 */
	public validate(options: OptionsVE = {}): boolean {
		const optionsValidate: OptionsVE = {
			noRender: options.noRender || false,
			noEmpty: options.noEmpty || false,
			message: options.message || this.message,
		};

		const result: ResultVE = useGetValid(this.$element, optionsValidate);

		if (result.message) this.messageComputed = result.message;
		if (result.valid && !result.error) useElementComplete(this.$element, { value: this.value });
		if (!optionsValidate.noRender) {
			this.valid = result.valid;
			this.error = result.error;
			this.render();
		}

		return result.valid;
	}

	private outsideHandler(event: MouseEvent): void {
		const $target: HTMLElement = event.target as HTMLElement;
		if (
			clickOutside(event, this.$selectContainer) &&
			!$target.classList.contains('form-select__option')
		) {
			this.$selectContainer?.classList.remove('active');
		}
	}

	private toggleHandler(): void {
		this.$selectContainer?.classList.toggle('active');
	}

	private removeHandler(event: MouseEvent): void {
		const $target: HTMLElement = event.target as HTMLElement;
		const current: HTMLElement | undefined = $target.closest('[data-value]');
		const value: string | undefined = current?.getAttribute('data-value');

		this.changeSelect(value, false);
	}

	private selectHandler(event: MouseEvent): void {
		const $target: HTMLElement = event.target as HTMLElement;
		const current: HTMLElement | undefined = $target.closest('[data-value]');
		const value: string | undefined = current?.getAttribute('data-value');
		const selected: boolean = current?.classList.contains('selected');

		this.changeSelect(value, !selected);

		if (!this.$element.multiple) this.toggleHandler();
	}

	private changeSelect(value: string, selected: boolean): void {
		if (!value) return;

		const current = Array.from(this.$element.options).find((option) => option.value === value);

		current.selected = selected;
		if (selected) this.value = current.value;

		this.renderResult();
		this.renderOptions();
		useElementChange(this.$element, { value: this.value });
	}

	private renderOptions(): void {
		let fragment: string = '';
		Array.from(this.$element.options).forEach((option) => {
			if (option.value) {
				fragment += this.createOption({
					value: option.value,
					text: option.text,
					selected: option.selected,
				});
			}
		});
		this.$selectOptions.innerHTML = fragment;
	}

	private renderResult(): void {
		const options = Array.from(this.$element.options).filter(
			(option) => option.selected && option.value,
		);

		let fragment: string = '';

		Array.from(options).forEach((option) => {
			fragment += this.createResult({
				value: option.value,
				text: option.text,
				selected: option.selected,
			});
		});

		this.$selectResult.innerHTML = fragment;
		this.$selectContainer?.classList.toggle('placeholder', !options.length);
	}

	private createOption(option: Option): string {
		const selected = option.selected ? 'selected' : '';
		return `<div class="form-select__option ${selected}" data-value="${option.value}">${option.text}</div>`;
	}

	private createResult(option: Option): string {
		if (this.$element.multiple) {
			return `
				<div class="form-select__vue">
					<span>${option.text}</span>
					<i class="form-select__icon-remove icon icon-close" data-value="${option.value}"></i>
				</div>
			`;
		} else {
			return `<div class="form-select__vue">${option.text}</div>`;
		}
	}
}
