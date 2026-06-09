import { classInstance, clickOutside } from '@/shared/helpers/helpers';
import { Scrollbar } from '@/shared/common/scrollbar/scrollbar';

/**
 * @desc UI Компонент Dropdown
 * @category 2 Common
 * @example
 * document.querySelectorAll('.js-dropdown').forEach((element) => {new Dropdown(element)});
 * @constructor
 * @param {HTMLElement} selector - HTMLElement контейнера
 * @param {Object} [options] - опции конфигурации
 * @param {String} [options.selectorButton=".js-dropdown__button"] - селектор кнопки элемента компонента
 * @param {String} [options.selectorContent=".js-dropdown__content"] - селектор контента элемента компонента
 */

export class Dropdown {
	readonly $container: HTMLElement;
	readonly selectorScroll: string;
	readonly selectorButton: string;
	readonly selectorContent: string;

	private isActive: boolean;

	protected scrollbar: InstanceType<typeof Scrollbar>;
	protected $scroll: HTMLElement | null;
	protected $button: HTMLElement | null;
	protected $content: HTMLElement | null;

	constructor(
		selector: HTMLElement,
		options: {
			selectorScroll?: string;
			selectorButton?: string;
			selectorContent?: string;
		} = {},
	) {
		this.$container = selector;

		if (!this.$container) return;

		this.selectorScroll = options.selectorScroll || '.js-dropdown__scroll';
		this.selectorButton = options.selectorButton || '.js-dropdown__button';
		this.selectorContent = options.selectorContent || '.js-dropdown__content';

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init(): void {
		classInstance.set(this.$container, { dropdown: this });

		this.$scroll = this.$container.querySelector(this.selectorScroll);
		this.$button = this.$container.querySelector(this.selectorButton);

		if (this.$scroll) this.scrollbar = new Scrollbar(this.$scroll);

		this.toggle(this.$container.classList.contains('active'));

		this.outsideHandler = this.outsideHandler.bind(this);
		document.addEventListener('click', this.outsideHandler);

		this.clickHandler = this.clickHandler.bind(this);
		this.$button?.addEventListener('click', this.clickHandler);
	}

	/**
	 * @desc Удалить обрабочики событий
	 */
	public destroy(): void {
		classInstance.del(this.$container, 'dropdown');

		this.scrollbar.destroy();
		document.removeEventListener('click', this.outsideHandler);
		this.$button?.removeEventListener('click', this.clickHandler);
	}

	/**
	 * @desc Переопределить обрабочики событий
	 * @example
	 * const myDropdown = app.classInstance.get(document.querySelector('.js-dropdown'));
	 * myDropdown.dropdown.reinit();
	 */
	public reinit(): void {
		this.destroy();
		this.init();
	}

	/**
	 * @desc Преключить состояние компонента
	 * @param {boolean} key - true - открыть dropdown, false - закрыть dropdown
	 * @example
	 * const myDropdown = app.classInstance.get(document.querySelector('.js-dropdown'));
	 * myDropdown.dropdown.toggle(true);
	 */
	public toggle(key: boolean): void {
		key ? this.open() : this.close();
	}

	/**
	 * @desc Открыть компонент
	 * @example
	 * const myDropdown = app.classInstance.get(document.querySelector('.js-dropdown'));
	 * myDropdown.dropdown.open();
	 */
	public open(): void {
		this.isActive = true;
		this.$container.classList.add('active');
		this.dispatchOpen(this.$container);
	}

	/**
	 * @desc Закрыть компонент
	 * @example
	 * const myDropdown = app.classInstance.get(document.querySelector('.js-dropdown'));
	 * myDropdown.dropdown.close();
	 */
	public close(): void {
		this.isActive = false;
		this.$container.classList.remove('active');
		this.dispatchClose(this.$container);
	}

	private outsideHandler(event: MouseEvent): void {
		if (clickOutside(event, this.$container) && this.isActive) this.close();
	}

	private clickHandler(): void {
		this.toggle(!this.isActive);
	}

	private dispatchOpen($element: HTMLElement): void {
		$element.dispatchEvent(
			/**
			 * @desc событие открытия элемента компонента.
			 * @category 2 Common
			 * @event Dropdown#dropdownOpen
			 * @property {Object} detail.dropdown - контекст экземпляра класса
			 * @example
			 * document.querySelector('.js-dropdown').addEventListener('dropdownOpen', (event) => {
			 * 	console.log(event.detail.dropdown);
			 * });
			 */
			new CustomEvent('dropdownOpen', {
				detail: {
					dropdown: this,
				},
			}),
		);
	}

	private dispatchClose($element: HTMLElement): void {
		$element.dispatchEvent(
			/**
			 * @desc событие закрытия элемента компонента.
			 * @category 2 Common
			 * @event Dropdown#dropdownСlose
			 * @property {Object} detail.dropdown - контекст экземпляра класса
			 * @example
			 * document.querySelector('.js-dropdown').addEventListener('dropdownСlose', (event) => {
			 * 	console.log(event.detail.dropdown);
			 * });
			 */
			new CustomEvent('dropdownСlose', {
				detail: {
					dropdown: this,
				},
			}),
		);
	}
}
