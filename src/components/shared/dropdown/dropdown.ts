import { classInstance, clickOutside } from '@/common/helpers';
import type { DropdownMode, DropdownOptions, DropdownOpenDetail, DropdownCloseDetail } from './dropdown.types';

/**
 * @desc UI Компонент Dropdown
 * @category 2 Common
 * @example
 * document.querySelectorAll('.js-dropdown').forEach((element) => {new Dropdown(element)});
 * @constructor
 * @param {HTMLElement} selector - HTMLElement контейнера
 * @param {Object} [options] - опции конфигурации
 * @param {String} [options.mode="mouseenter"] - тип действия mouseenter || click
 * @param {String} [options.selectorButton=".js-dropdown__button"] - селектор кнопки элемента компонента
 */

export default class Dropdown {
	readonly $container: HTMLElement;
	readonly selectorButton: string;

	protected mode: DropdownMode;
	protected $button: HTMLElement | null = null;

	constructor(selector: HTMLElement, options: DropdownOptions = {}) {
		this.$container = selector;

		const containerMode = this.$container.dataset.dropdown as DropdownMode | undefined;
		this.mode = options.mode || containerMode || 'mouseenter';

		this.selectorButton = options.selectorButton || '.js-dropdown__button';

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init() {
		classInstance.set(this.$container, { dropdown: this });
		this.$button = this.$container.querySelector<HTMLElement>(this.selectorButton);

		if (!window.matchMedia('(hover: hover)').matches) {
			this.mode = 'click';
		}

		this.updateAriaAttributes(this.$container.classList.contains('active'));

		if (this.mode === 'mouseenter') {
			this.$container.addEventListener('mouseenter', this.mouseenterHandler);
			this.$container.addEventListener('mouseleave', this.mouseleaveHandler);

			this.$container.addEventListener('focusin', this.mouseenterHandler);
			this.$container.addEventListener('focusout', this.mouseleaveHandler);
		}

		if (this.mode === 'click') {
			document.addEventListener('click', this.outsideHandler);
			this.$button?.addEventListener('click', this.clickHandler);
			this.$container.addEventListener('keydown', this.escapeHandler);
		}
	}

	/**
	 * @desc Удалить обрабочики событий и сбросить состояние
	 */
	public destroy() {
		classInstance.del(this.$container, 'dropdown');

		if (this.mode === 'mouseenter') {
			this.$container.removeEventListener('mouseenter', this.mouseenterHandler);
			this.$container.removeEventListener('mouseleave', this.mouseleaveHandler);
			this.$container.removeEventListener('focusin', this.mouseenterHandler);
			this.$container.removeEventListener('focusout', this.mouseleaveHandler);
		}

		if (this.mode === 'click') {
			document.removeEventListener('click', this.outsideHandler);
			this.$button?.removeEventListener('click', this.clickHandler);
			this.$container.removeEventListener('keydown', this.escapeHandler);
		}

		this.$button = null;
	}

	/**
	 * @desc Переопределить обрабочики событий
	 * @example
	 * const myDropdown = app.classInstance.get(document.querySelector('.js-dropdown'));
	 * myDropdown.dropdown.reinit();
	 */
	public reinit() {
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
	public toggle(key: boolean) {
		if (key) {
			this.open();
		} else {
			this.close();
		}
	}

	/**
	 * @desc Открыть компонент
	 * @example
	 * const myDropdown = app.classInstance.get(document.querySelector('.js-dropdown'));
	 * myDropdown.dropdown.open();
	 */
	public open() {
		if (this.$container.classList.contains('active')) return;

		this.$container.classList.add('active');
		this.updateAriaAttributes(true);
		this.dispatchOpen(this.$container);
	}

	/**
	 * @desc Закрыть компонент
	 * @example
	 * const myDropdown = app.classInstance.get(document.querySelector('.js-dropdown'));
	 * myDropdown.dropdown.close();
	 */
	public close() {
		if (!this.$container.classList.contains('active')) return;

		this.$container.classList.remove('active');
		this.updateAriaAttributes(false);
		this.dispatchClose(this.$container);
	}

	private updateAriaAttributes(isOpen: boolean) {
		this.$button?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
	}

	private mouseenterHandler = () => {
		this.toggle(true);
	};

	private mouseleaveHandler = () => {
		this.toggle(false);
	};

	private outsideHandler = (event: MouseEvent) => {
		if (clickOutside(event, this.$container) && this.$container.classList.contains('active')) this.close();
	};

	private clickHandler = (event: MouseEvent) => {
		const isLink = this.$button?.tagName === 'A';
		const isActive = this.$container.classList.contains('active');

		if (isLink && !isActive) {
			event.preventDefault();
		}

		this.toggle(!isActive);
	};

	private escapeHandler = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && this.$container.classList.contains('active')) {
			this.close();
			this.$button?.focus();
		}
	};

	private dispatchOpen($element: HTMLElement) {
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
			new CustomEvent<DropdownOpenDetail>('dropdownOpen', {
				detail: {
					dropdown: this,
				},
			}),
		);
	}

	private dispatchClose($element: HTMLElement) {
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
			new CustomEvent<DropdownCloseDetail>('dropdownСlose', {
				detail: {
					dropdown: this,
				},
			}),
		);
	}
}
