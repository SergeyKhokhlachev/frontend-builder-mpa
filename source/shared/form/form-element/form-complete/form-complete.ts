import { classInstance, clickOutside } from '@/shared/helpers/helpers';
import { Scrollbar } from '@/shared/common/scrollbar/scrollbar';

import { FormElement } from '../form-element';

import { useElementChange, useElementComplete } from '../composition/elementEvents';
import { useGetValid } from './composition/getValid';

/**
 * @desc UI Компонент FormComplete
 * @category 3 Form
 * @example
 * new FormComplete(document.querySelector('input[data-type="form-complete"]'));
 * @constructor
 * @param {HTMLInputElement} selector - HTMLInputElement формы
 * @param {Object} [options] - опции конфигурации
 * @param {String} [options.message="complete"] - имя правила для вывода сообщений об ошибке, если не указанно - береться значение attr data-message
 * @param {String} [options.empty="Нет данных ..."] - сообщение об отсутствии данных
 * @param {String} [options.selectorСompleteContainer=".js-form-complete"] - селектор контейнера поля
 * @param {String} [options.selectorСompleteDropdown=".js-form-complete__dropdown"] - селектор выподающего блока
 * @param {String} [options.selectorСompleteScroll=".js-form-complete__scrollbar"] - селектор скроллбара
 * @param {String} [options.selectorСompleteOptions=".js-form-complete__options"] - селектор списка значений
 */

export class FormComplete extends FormElement {
	readonly $element: HTMLInputElement;
	readonly selectorСompleteContainer: string;
	readonly selectorСompleteDropdown: string;
	readonly selectorСompleteScroll: string;
	readonly selectorСompleteOptions: string;

	protected message: string;
	protected value: string;
	protected empty: string;
	protected complite: boolean;
	protected options: Array<Option>;

	protected scrollbar: InstanceType<typeof Scrollbar>;
	protected $сompleteContainer: HTMLElement | null;
	protected $сompleteDropdown: HTMLElement | null;
	protected $сompleteScroll: HTMLElement | null;
	protected $сompleteOptions: HTMLElement | null;

	constructor(
		selector: HTMLInputElement,
		options: {
			message?: string;
			empty?: string;
			selectorContainer?: string;
			selectorMessage?: string;
			selectorСompleteContainer?: string;
			selectorСompleteDropdown?: string;
			selectorСompleteScroll?: string;
			selectorСompleteOptions?: string;
		} = {},
	) {
		super(selector, options);

		this.options = [];

		this.complite = false;
		this.empty = options.empty || 'Нет данных ...';
		this.message = options.message || this.$element.dataset.message || 'complete';
		this.selectorСompleteContainer = options.selectorСompleteContainer || '.js-form-complete';
		this.selectorСompleteDropdown =
			options.selectorСompleteDropdown || '.js-form-complete__dropdown';
		this.selectorСompleteScroll =
			options.selectorСompleteScroll || '.js-form-complete__scrollbar';
		this.selectorСompleteOptions =
			options.selectorСompleteOptions || '.js-form-complete__options';

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init(): void {
		classInstance.set(this.$element, { formElement: this });

		super.init();

		this.$сompleteContainer = this.$element.closest(this.selectorСompleteContainer);
		this.$сompleteDropdown = this.$сompleteContainer.querySelector(this.selectorСompleteDropdown);
		this.$сompleteScroll = this.$сompleteContainer.querySelector(this.selectorСompleteScroll);
		this.$сompleteOptions = this.$сompleteContainer.querySelector(this.selectorСompleteOptions);

		this.renderOptions();

		if (this.$сompleteScroll) this.scrollbar = new Scrollbar(this.$сompleteScroll);

		this.outsideHandler = this.outsideHandler.bind(this);
		document.addEventListener('click', this.outsideHandler);

		this.changeHandler = this.changeHandler.bind(this);
		this.$element.addEventListener('change', this.changeHandler);
		this.$element.addEventListener('input', this.changeHandler);

		this.openHandler = this.openHandler.bind(this);
		this.$element.addEventListener('click', this.openHandler);

		this.selectHandler = this.selectHandler.bind(this);
		this.$сompleteOptions?.addEventListener('click', this.selectHandler);
	}

	/**
	 * @desc Удалить обрабочики событий
	 */
	public destroy(): void {
		classInstance.del(this.$element, 'formElement');

		this.scrollbar.destroy();
		document.removeEventListener('click', this.outsideHandler);
		this.$element.removeEventListener('change', this.changeHandler);
		this.$element.removeEventListener('input', this.changeHandler);
		this.$element.removeEventListener('click', this.openHandler);
		this.$сompleteOptions?.removeEventListener('click', this.selectHandler);
	}

	/**
	 * @desc Переопределить обрабочики событий
	 * @example
	 * const myElement= app.classInstance.get(document.querySelector('input[data-type="form-complete"]'));
	 * myElement.formElement.reinit();
	 */
	public reinit(): void {
		this.destroy();
		this.init();
	}

	/**
	 * @desc Обновить value элемента
	 * @param {String} [value] - новое значение элемента
	 */
	public setValue(value: string) {
		this.value = value;
		this.$element.value = value;
	}

	/**
	 * @desc Обновить список опций элемента
	 * @param {Array} [options] - новый список опций элемента
	 */
	public setOptions(options: Array<Option>) {
		this.options = options;
		this.renderOptions();
	}

	/**
	 * @desc Метод валидации элемента
	 * @param {Object} [options] - опции конфигурации
	 * @param {Boolean} [options.noRender=false] - если указать true - представление не будет обновляться при валидации.
	 * @param {Boolean} [options.noEmpty=false] - если указать true - пустое поле не будет валидироваться
	 * @param {String} [options.message] - имя правила для вывода сообщений об ошибке
	 * @returns {Boolean} результат валидации
	 * @example
	 * const myElement = app.classInstance.get(document.querySelector('input[data-type="form-complete"]'));
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
			this.complite,
			this.selected(this.value),
			optionsValidate,
		);

		if (result.message) this.messageComputed = result.message;
		if (result.valid && !result.error) {
			this.complite = true;
			useElementComplete(this.$element, {
				value: this.value,
				selected: this.selected(this.value),
			});
		}

		if (!optionsValidate.noRender) {
			this.valid = result.valid;
			this.error = result.error;
			this.render();
		}

		return result.valid;
	}

	private outsideHandler(event: MouseEvent): void {
		if (clickOutside(event, this.$сompleteContainer))
			this.$сompleteContainer?.classList.remove('active');
	}

	private openHandler(): void {
		this.toggleOptions(true);
	}

	private changeHandler(event: InputEvent): void {
		const $target: HTMLInputElement = event.target as HTMLInputElement;
		this.value = $target.value;
		this.complite = false;
		useElementChange(this.$element, {
			value: this.value,
			selected: this.selected(this.value),
		});
	}

	private selectHandler(event: MouseEvent): void {
		const $target: HTMLElement = event.target as HTMLElement;
		const current: HTMLElement | undefined = $target.closest('[data-value]');
		const value: string | undefined = current?.getAttribute('data-value');

		this.toggleOptions(false);

		this.value = value;
		this.$element.value = value;
		this.complite = false;
		useElementChange(this.$element, {
			value: this.value,
			selected: this.selected(this.value),
		});
	}

	private toggleOptions(key: boolean): void {
		this.$сompleteContainer?.classList.toggle('active', key);
	}

	private renderOptions(): void {
		let fragment: string = '';
		Array.from(this.options).forEach((option) => {
			if (option.value) {
				fragment += this.createOption({
					value: option.value,
					text: option.text,
					complete: option.complete,
				});
			}
		});
		if (fragment) {
			this.$сompleteOptions.innerHTML = fragment;
		} else {
			this.$сompleteOptions.innerHTML = `<div class="form-complete__empty">${this.empty}</div>`;
		}
	}

	private createOption(option: Option): string {
		const selected = this.value === option.value ? 'selected' : '';
		return `<div class="form-complete__option ${selected}" data-value="${option.value}">${option.text}</div>`;
	}

	private selected(value: string): Option | undefined {
		return this.options.find((option: Option) => value === option.value);
	}
}
