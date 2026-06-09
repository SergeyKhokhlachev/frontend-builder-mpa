import { classInstance } from '@/shared/helpers/helpers';

/**
 * @desc UI Компонент Scrollto
 * @category 2 Common
 * @example
 * document.querySelectorAll('.js-scrollto').forEach((element) => {new Scrollto(element)});
 * @constructor
 * @param {HTMLElement} selector - HTMLElement контейнера
 * @param {Object} [options] - опции конфигурации
 * @param {Number} [options.offset=0] - отступ сверху
 * @param {ScrollBehavior} [options.behavior="smooth"] - тип анимации "auto" | "instant" | "smooth"
 * @param {String} [options.selectorIndent=".js-scrollto-offset"] - селектор блока, высота которого будет добавлена к оступу сверху
 */

export class Scrollto {
	readonly $container: HTMLElement;
	readonly offset: number;
	readonly behavior: ScrollBehavior;
	readonly selectorIndent: string;

	constructor(
		selector: HTMLElement,
		options: {
			offset?: number;
			behavior?: ScrollBehavior;
			selectorIndent?: string;
		} = {},
	) {
		this.$container = selector;

		if (!this.$container) return;

		this.offset = options.offset || 0;
		this.behavior = options.behavior || 'smooth';
		this.selectorIndent = options.selectorIndent || '.js-scrollto-offset';

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init(): void {
		classInstance.set(this.$container, { scrollto: this });

		this.clickHandler = this.clickHandler.bind(this);
		this.$container.addEventListener('click', this.clickHandler);
	}

	/**
	 * @desc Удалить обрабочики событий
	 */
	public destroy(): void {
		classInstance.del(this.$container, 'scrollto');

		this.$container.removeEventListener('click', this.clickHandler);
	}

	/**
	 * @desc Переопределить обрабочики событий
	 * @example
	 * const myElement = app.classInstance.get(document.querySelector('.js-scrollto'));
	 * myElement.scrollto.reinit();
	 */
	public reinit(): void {
		this.destroy();
		this.init();
	}

	private clickHandler(event: MouseEvent): void {
		event.preventDefault();

		const $target: HTMLElement = event.target as HTMLElement;
		const $element: HTMLElement = $target.closest('[href]') || $target.closest('[data-href]');

		if (!$element) return;

		const anchor: string = $element.getAttribute('href') || $element.getAttribute('data-href');

		if (anchor) this.scroll(anchor);
	}

	private scroll(anchor: string): void {
		const $target: HTMLElement = document.getElementById(anchor);
		const $indent: HTMLElement | null = document.querySelector(this.selectorIndent);

		if (!$target) return;

		const height = $indent ? $indent.offsetHeight : 0;
		const position = $target.getBoundingClientRect().top + document.documentElement.scrollTop;

		window.scrollTo({
			top: position - this.offset - height,
			behavior: this.behavior,
		});
	}
}
