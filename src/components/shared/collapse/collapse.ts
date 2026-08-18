import { classInstance } from '@/common/helpers';
import type { CollapseMode, CollapseOptions, CollapseOpenDetail, CollapseCloseDetail } from './collapse.types';

/**
 * UI Компонент Collapse / Accordion
 * @category 2 Common
 * @example
 * document.querySelectorAll('.js-collapse').forEach((element) => {new Collapse(element)});
 *
 * @param {HTMLElement} selector - HTMLElement контейнера
 * @param {Object} [options] - опции конфигурации
 * @param {String} [options.mode="collapse"] - тип отображения collapse || accordion
 * @param {String} [options.selectorElement=".js-collapse__element"] - селектор элемента компонента
 * @param {String} [options.selectorButton=".js-collapse__button"] - селектор кнопки элемента компонента
 */

export default class Collapse {
	readonly $container: HTMLElement;
	readonly mode: CollapseMode;
	readonly selectorElement: string;
	readonly selectorButton: string;

	protected $element: HTMLElement | null = null;
	protected $elements: HTMLElement[] = [];

	constructor(selector: HTMLElement, options: CollapseOptions = {}) {
		this.$container = selector;
		const containerMode = this.$container.dataset.collapse as CollapseMode | undefined;
		this.mode = options.mode || containerMode || 'collapse';

		this.selectorElement = options.selectorElement || '.js-collapse__element';
		this.selectorButton = options.selectorButton || '.js-collapse__button';

		this.init();
	}

	/**
	 * Инициализировать компонент
	 */
	public init() {
		classInstance.set(this.$container, { collapse: this });
		this.$elements = Array.from(this.$container.querySelectorAll(this.selectorElement));

		this.$elements.forEach(($element) => {
			const $button = $element.querySelector<HTMLElement>(this.selectorButton);
			if ($button) {
				const isActive = $element.classList.contains('active');
				$button.setAttribute('aria-expanded', isActive ? 'true' : 'false');
				$button.addEventListener('click', this.clickHandler);
				$button.addEventListener('keydown', this.keydownHandler);
			}
		});
	}

	/**
	 *  Удалить обработчики событий
	 */
	public destroy() {
		classInstance.del(this.$container, 'collapse');

		this.$elements.forEach(($element) => {
			const $button = $element.querySelector<HTMLElement>(this.selectorButton);
			if ($button) {
				$button.removeEventListener('click', this.clickHandler);
				$button.removeEventListener('keydown', this.keydownHandler);
			}
		});

		this.$elements = [];
	}

	/**
	 *  Переопределить обработчики событий
	 * @example
	 * const myСollapse = app.classInstance.get(document.querySelector('.js-collapse'));
	 * myСollapse.collapse.reinit();
	 */
	public reinit() {
		this.destroy();
		this.init();
	}

	/**
	 *  Переключить состояние компонента
	 * @param {HTMLElement} $element - HTMLElement компонента
	 * @param {boolean} key - true - открыть dropdown, false - закрыть dropdown
	 * @example
	 * const myСollapse = app.classInstance.get(document.querySelector('.js-collapse'));
	 * myСollapse.collapse.toggle(myСollapse.querySelector('.js-collapse__element'), true);
	 */
	public toggle($element: HTMLElement, key: boolean) {
		if (key) {
			this.open($element);
		} else {
			this.close($element);
		}
	}

	/**
	 *  Открыть элемент компонента
	 * @param {HTMLElement} $element - HTMLElement компонента
	 */
	public open($element: HTMLElement) {
		if (this.mode === 'accordion') {
			const $active = this.$elements.find((element) => element.classList.contains('active'));
			if ($active) this.close($active);
		}

		$element.classList.add('active');

		const $button = $element.querySelector(this.selectorButton);
		$button?.setAttribute('aria-expanded', 'true');

		this.dispatchOpen($element);
	}

	/**
	 *  Закрыть элемент компонента
	 * @param {HTMLElement} $element - HTMLElement компонента
	 */
	public close($element: HTMLElement) {
		$element.classList.remove('active');

		const $button = $element.querySelector(this.selectorButton);
		$button?.setAttribute('aria-expanded', 'false');

		this.dispatchClose($element);
	}

	private clickHandler = (event: MouseEvent) => {
		const $target = event.currentTarget as HTMLElement;
		const $element = $target.closest<HTMLElement>(this.selectorElement);

		if (!$element) return;

		this.toggle($element, !$element.classList.contains('active'));
	};

	private keydownHandler = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			const $target = event.currentTarget as HTMLElement;
			const $element = $target.closest<HTMLElement>(this.selectorElement);

			if (!$element) return;

			this.toggle($element, !$element.classList.contains('active'));
		}
	};

	private dispatchOpen($element: HTMLElement) {
		$element.dispatchEvent(
			/**
			 *  событие открытия элемента компонента.
			 * @category 2 Common
			 * @event Collapse#сollapseOpen
			 * @property {Object} detail.collapse - контекст экземпляра класса
			 * @example
			 * document.querySelector('.js-collapse__element').addEventListener('сollapseOpen', (event) => {
			 * 	console.log(event.detail.collapse);
			 * });
			 */
			new CustomEvent<CollapseOpenDetail>('collapseOpen', {
				detail: { collapse: this },
			}),
		);
	}

	private dispatchClose($element: HTMLElement) {
		$element.dispatchEvent(
			/**
			 *  событие закрытия элемента компонента.
			 * @category 2 Common
			 * @event Collapse#сollapseСlose
			 * @property {Object} detail.collapse - контекст экземпляра класса
			 * @example
			 * document.querySelector('.js-collapse__element').addEventListener('сollapseСlose', (event) => {
			 * 	console.log(event.detail.collapse);
			 * });
			 */
			new CustomEvent<CollapseCloseDetail>('сollapseСlose', {
				detail: { collapse: this },
			}),
		);
	}
}
