import { classInstance } from '@/common/helpers';
import type { TabsMode, TabsOptions, TabsShownDetail } from './tabs.types';

/**
 *  UI Компонент Tabs
 * @category 2 Common
 * @example
 * document.querySelectorAll('.js-tabs').forEach((element) => {new Tabs(element)});
 *
 * @param {HTMLElement} selector - HTMLElement контейнера
 * @param {Object} [options] - опции конфигурации
 * @param {String} [options.mode="mouseenter"] - тип действия mouseenter || click
 * @param {String} [options.selectorButton=".js-tabs__button"] - селектор кнопки элемента компонента
 * @param {String} [options.selectorContent=".js-tabs__element"] - селектор контента элемента компонента
 */

export default class Tabs {
	readonly $container: HTMLElement;
	readonly selectorButton: string;
	readonly selectorElement: string;

	protected mode: TabsMode;
	protected $buttons: Array<HTMLElement> = [];
	protected $elements: Array<HTMLElement> = [];
	protected $buttonActive: HTMLElement | undefined = undefined;
	protected $elementActive: HTMLElement | undefined = undefined;

	constructor(selector: HTMLElement, options: TabsOptions = {}) {
		this.$container = selector;

		const containerMode = this.$container.dataset.tabs as TabsMode | undefined;
		this.mode = options.mode || containerMode || 'click';

		this.selectorButton = options.selectorButton || '.js-tabs__button';
		this.selectorElement = options.selectorElement || '.js-tabs__element';

		this.init();
	}

	/**
	 *  Инициализировать компонент
	 */
	public init() {
		classInstance.set(this.$container, { tabs: this });

		this.$buttons = Array.from(this.$container.querySelectorAll(this.selectorButton));
		this.$elements = Array.from(this.$container.querySelectorAll(this.selectorElement));
		this.$buttonActive = this.$buttons.find(($button) => $button.classList.contains('active')) || this.$buttons[0];

		if (!window.matchMedia('(hover: hover)').matches) {
			this.mode = 'click';
		}

		const activeId = this.$buttonActive?.getAttribute('aria-controls');

		this.$buttons.forEach(($button) => {
			const isActive = $button === this.$buttonActive;
			$button.setAttribute('aria-selected', isActive ? 'true' : 'false');
			$button.setAttribute('tabindex', isActive ? '0' : '-1');
			if (isActive) $button.classList.add('active');
		});

		this.$elements.forEach(($element) => {
			const isActive = activeId === $element.id;
			if (isActive) {
				this.$elementActive = $element;
				$element.classList.add('active');
				$element.removeAttribute('hidden');
			} else {
				$element.classList.remove('active');
				$element.setAttribute('hidden', '');
			}
		});

		if (this.mode === 'mouseenter') {
			this.$buttons.forEach(($button) => {
				$button.addEventListener('mouseenter', this.openHandler);
				$button.addEventListener('keydown', this.keydownHandler);
			});
		}

		if (this.mode === 'click') {
			this.$buttons.forEach(($button) => {
				$button.addEventListener('click', this.openHandler);
				$button.addEventListener('keydown', this.keydownHandler);
			});
		}
	}

	/**
	 *  Удалить обработчики событий
	 */
	public destroy() {
		classInstance.del(this.$container, 'tabs');

		if (this.mode === 'mouseenter') {
			this.$buttons.forEach(($button) => {
				$button.removeEventListener('mouseenter', this.openHandler);
				$button.removeEventListener('keydown', this.keydownHandler);
			});
		}

		if (this.mode === 'click') {
			this.$buttons.forEach(($button) => {
				$button.removeEventListener('click', this.openHandler);
				$button.removeEventListener('keydown', this.keydownHandler);
			});
		}

		this.$buttons = [];
		this.$elements = [];
		this.$buttonActive = undefined;
		this.$elementActive = undefined;
	}

	/**
	 *  Переопределить обрабочики событий
	 * @example
	 * const myTabs = app.classInstance.get(document.querySelector('.js-tabs'));
	 * myTabs.tabs.reinit();
	 */
	public reinit() {
		this.destroy();
		this.init();
	}

	/**
	 *  Открыть элемент компонента
	 * @param {String} tabId - id элемента компонента
	 */
	public open(tabId: string) {
		const $nextButton = this.$buttons.find(($button) => $button.getAttribute('aria-controls') === tabId);
		const $nextElement = this.$elements.find(($element) => $element.id === tabId);

		if (!$nextButton || !$nextElement || $nextButton === this.$buttonActive) return;

		if (this.$buttonActive) {
			this.$buttonActive.classList.remove('active');
			this.$buttonActive.setAttribute('aria-selected', 'false');
			this.$buttonActive.setAttribute('tabindex', '-1');
		}

		if (this.$elementActive) {
			this.$elementActive.classList.remove('active');
			this.$elementActive.setAttribute('hidden', '');
		}

		this.$buttonActive = $nextButton;
		this.$elementActive = $nextElement;

		this.$buttonActive.classList.add('active');
		this.$buttonActive.setAttribute('aria-selected', 'true');
		this.$buttonActive.setAttribute('tabindex', '0');

		this.$elementActive.classList.add('active');
		this.$elementActive.removeAttribute('hidden');

		this.dispatchActive(this.$container);
	}

	private openHandler = (event: Event) => {
		const $button = (event.currentTarget as HTMLElement).closest<HTMLElement>(this.selectorButton);
		const tabId = $button?.getAttribute('aria-controls');

		if (tabId) {
			$button?.focus();
			this.open(tabId);
		}
	};

	private keydownHandler = (event: KeyboardEvent) => {
		const index = this.$buttons.indexOf(event.currentTarget as HTMLElement);
		if (index === -1) return;

		let targetIndex: number;

		switch (event.key) {
			case 'ArrowRight':
			case 'ArrowDown':
				targetIndex = (index + 1) % this.$buttons.length;
				break;
			case 'ArrowLeft':
			case 'ArrowUp':
				targetIndex = (index - 1 + this.$buttons.length) % this.$buttons.length;
				break;
			case 'Home':
				targetIndex = 0;
				break;
			case 'End':
				targetIndex = this.$buttons.length - 1;
				break;
			default:
				return;
		}

		event.preventDefault();
		const $nextButton = this.$buttons[targetIndex];
		const tabId = $nextButton.getAttribute('aria-controls');

		if (tabId) {
			this.open(tabId);
			$nextButton.focus();
		}
	};

	private dispatchActive(element: HTMLElement) {
		element.dispatchEvent(
			/**
			 *  событие открытия элемента компонента.
			 * @category 2 Common
			 * @event Tabs#tabShown
			 * @property {Object} detail.tabs - контекст экземпляра класса
			 * @example
			 * document.querySelector('.js-tabs').addEventListener('tabShown', (event) => {
			 * 	console.log(event.detail.tabs);
			 * });
			 */
			new CustomEvent<TabsShownDetail>('tabShown', {
				detail: { tabs: this },
			}),
		);
	}
}
