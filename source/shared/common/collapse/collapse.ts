import { classInstance } from '@/shared/helpers/helpers';

/**
 * @desc UI Компонент Collapse / Accordion
 * @category 2 Common
 * @example
 * document.querySelectorAll('.js-collapse').forEach((element) => {new Collapse(element)});
 * @constructor
 * @param {HTMLElement} selector - HTMLElement контейнера
 * @param {Object} [options] - опции конфигурации
 * @param {String} [options.mode="collapse"] - тип отображения collapse || accordion
 * @param {Number} [options.duration=200] - время выполнения анимации
 * @param {String} [options.selectorElement=".js-collapse__element"] - селектор элемента компонента
 * @param {String} [options.selectorButton=".js-collapse__button"] - селектор кнопки элемента компонента
 * @param {String} [options.selectorContent=".js-collapse__content"] - селектор контента элемента компонента
 */

export class Collapse {
	readonly $container: HTMLElement;
	readonly mode: string;
	readonly duration: number;
	readonly selectorElement: string;
	readonly selectorButton: string;
	readonly selectorContent: string;

	protected $elements: Array<HTMLElement>;

	constructor(
		selector: HTMLElement,
		options: {
			mode?: string;
			duration?: number;
			selectorElement?: string;
			selectorButton?: string;
			selectorContent?: string;
		} = {},
	) {
		this.$container = selector;

		if (!this.$container) return;

		this.mode = options.mode || this.$container.dataset.collapse || 'collapse';
		this.duration = options.duration || 200;
		this.selectorElement = options.selectorElement || '.js-collapse__element';
		this.selectorButton = options.selectorButton || '.js-collapse__button';
		this.selectorContent = options.selectorContent || '.js-collapse__content';

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init(): void {
		classInstance.set(this.$container, { collapse: this });
		this.$elements = Array.from(this.$container.querySelectorAll(this.selectorElement));

		this.clickHandler = this.clickHandler.bind(this);
		this.$elements.forEach(($element) => {
			const $button: HTMLElement | null = $element.querySelector(this.selectorButton);
			$button?.addEventListener('click', this.clickHandler);
		});
	}

	/**
	 * @desc Удалить обрабочики событий
	 */
	public destroy(): void {
		classInstance.del(this.$container, 'collapse');

		this.$elements.forEach((element) => {
			const $button: HTMLElement | null = element.querySelector(this.selectorButton);
			$button?.removeEventListener('click', this.clickHandler);
		});
	}

	/**
	 * @desc Переопределить обрабочики событий
	 * @example
	 * const myСollapse = app.classInstance.get(document.querySelector('.js-collapse'));
	 * myСollapse.collapse.reinit();
	 */
	public reinit(): void {
		this.destroy();
		this.init();
	}

	/**
	 * @desc Преключить состояние компонента
	 * @param {HTMLElement} $element - HTMLElement компонента
	 * @param {boolean} key - true - открыть dropdown, false - закрыть dropdown
	 * @example
	 * const myСollapse = app.classInstance.get(document.querySelector('.js-collapse'));
	 * myСollapse.collapse.toggle(myСollapse.querySelector('.js-collapse__element'), true);
	 */
	public toggle($element: HTMLElement, key: boolean): void {
		key ? this.open($element) : this.close($element);
	}

	/**
	 * @desc Открыть элемент компонента
	 * @param {HTMLElement} $element - HTMLElement компонента
	 */
	public open($element: HTMLElement): void {
		const $content: HTMLElement | null = $element.querySelector(this.selectorContent);

		if (!$content) return;

		if (this.mode === 'accordion') {
			const $active = this.$elements.find((element) => element.classList.contains('shown'));
			if ($active) this.close($active);
		}

		$element.classList.add('shown');
		this.dispatchOpen($element);
		requestAnimationFrame(this.processOpen.bind(this, $content, performance.now()));
	}

	/**
	 * @desc Закрыть элемент компонента
	 * @param {HTMLElement} $element - HTMLElement компонента
	 */
	public close($element: HTMLElement): void {
		const $content: HTMLElement | null = $element.querySelector(this.selectorContent);

		if (!$content) return;

		$element.classList.remove('shown');
		this.dispatchClose($element);
		requestAnimationFrame(this.processClose.bind(this, $content, performance.now()));
	}

	private clickHandler(event: MouseEvent): void {
		const $target: HTMLElement = event.target as HTMLElement;
		const $element: HTMLElement | null = $target.closest(this.selectorElement);

		if (!$element) return;

		this.toggle($element, !$element.classList.contains('shown'));
	}

	private processOpen($element: HTMLElement, start: number, time: number): void {
		const process: number = Math.min((time - start) / this.duration, 1);
		if (process < 1) {
			$element.style.height = `${process * $element.scrollHeight}px`;
			requestAnimationFrame(this.processOpen.bind(this, $element, start));
		} else {
			$element.style.height = 'auto';
			$element.style.overflow = 'initial';
		}
	}

	private processClose($element: HTMLElement, start: number, time: number): void {
		const process: number = Math.min((time - start) / this.duration, 1);
		if (process < 1) {
			$element.style.height = `${$element.scrollHeight - process * $element.scrollHeight}px`;
			$element.style.overflow = 'hidden';
			requestAnimationFrame(this.processClose.bind(this, $element, start));
		} else {
			$element.style.height = '';
			$element.style.overflow = '';
		}
	}

	private dispatchOpen($element: HTMLElement): void {
		$element.dispatchEvent(
			/**
			 * @desc событие открытия элемента компонента.
			 * @category 2 Common
			 * @event Collapse#сollapseOpen
			 * @property {Object} detail.collapse - контекст экземпляра класса
			 * @example
			 * document.querySelector('.js-collapse__element').addEventListener('сollapseOpen', (event) => {
			 * 	console.log(event.detail.collapse);
			 * });
			 */
			new CustomEvent('сollapseOpen', {
				detail: {
					collapse: this,
				},
			}),
		);
	}

	private dispatchClose($element: HTMLElement): void {
		$element.dispatchEvent(
			/**
			 * @desc событие закрытия элемента компонента.
			 * @category 2 Common
			 * @event Collapse#сollapseСlose
			 * @property {Object} detail.collapse - контекст экземпляра класса
			 * @example
			 * document.querySelector('.js-collapse__element').addEventListener('сollapseСlose', (event) => {
			 * 	console.log(event.detail.collapse);
			 * });
			 */
			new CustomEvent('сollapseСlose', {
				detail: {
					collapse: this,
				},
			}),
		);
	}
}
