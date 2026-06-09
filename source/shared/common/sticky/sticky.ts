import { classInstance } from '@/shared/helpers/helpers';

/**
 * @desc UI Компонент Sticky
 * @category 2 Common
 * @example
 * document.querySelectorAll('.js-sticky').forEach((element) => {new Sticky(element)});
 * @constructor
 * @param {HTMLElement} selector - HTMLElement контейнера
 * @param {Object} [options] - опции конфигурации
 * @param {Number} [options.breakpoint=0] - media брейкпоинт, при ширине экрана меньше брейкпоинта - действие компонента блокируется
 * @param {Number} [options.top=0] - отступ сверху
 * @param {Number} [options.bottom=0] - отступ снизу
 * @param {String} [options.selectorTrack=".js-sticky-track"] - селектор области перемещения
 * @param {String} [options.selectorIndent=".js-sticky-indent"] - селектор блока, высота которого будет добавлена к оступу сверху
 */

// TODO: need refact, copy from components
export class Sticky {
	readonly $container: HTMLElement;
	readonly breakpoint: number;
	readonly indent: { top: number; bottom: number };
	readonly selectorTrack: string;
	readonly selectorIndent: string;

	protected indentBottom: number;
	protected indentTop: number;

	protected type: string;
	protected direction: string;
	protected containerRect: DOMRect;
	protected trackRect: DOMRect;
	protected tempPosition: number;
	protected windowHeight: number;
	protected windowScrolled: number;
	protected observer: ResizeObserver | null;

	protected $track: HTMLElement | null;
	protected $indent: HTMLElement | null;

	constructor(
		selector: HTMLElement,
		options: {
			breakpoint?: number | null;
			top?: number;
			bottom?: number;
			selectorTrack?: string;
			selectorIndent?: string;
		} = {},
	) {
		this.$container = selector;
		this.breakpoint = options.breakpoint || 0;
		this.indent = { top: options.top, bottom: options.bottom };

		this.indentBottom = options.bottom || 0;
		this.indentTop = this.getIndentTop;

		this.selectorTrack = options.selectorTrack || '.js-sticky-track';
		this.selectorIndent = options.selectorIndent || '.js-sticky-indent';

		this.$track = this.$container.closest(this.selectorTrack);

		this.windowHeight = this.getWindowHeight;
		this.windowScrolled = this.getWindowScrolled;
		this.tempPosition = 0;
		this.containerRect = this.getBoxRect;
		this.trackRect = this.getTrackRect;
		this.type = this.getType;
		this.direction = this.getDirection;

		this.observer = null;

		this.$container && this.$track && this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init(): void {
		classInstance.set(this.$container, { sticky: this });

		this.refresh = this.refresh.bind(this);
		this.breakpoint &&
			window.matchMedia(`(max-width:${this.breakpoint}px)`).addListener(this.refresh);

		this.refresh();
	}

	/**
	 * @desc Удалить обрабочики событий
	 */
	public destroy(): void {
		classInstance.del(this.$container, 'sticky');
		window.removeEventListener('scroll', this.scrollHandler);
		window.removeEventListener('resize', this.resizeHandler);

		this.reset();
		this.observer && this.observer.unobserve(this.$container);
	}

	/**
	 * @desc Обновить состояние компонента
	 * @example
	 * const mySticky = app.classInstance.get(document.querySelector('.js-sticky'));
	 * mySticky.sticky.update();
	 */
	public refresh(): void {
		if (this.breakpoint) {
			document.documentElement.clientWidth >= this.breakpoint
				? this.initEvents()
				: this.destroy();
		} else {
			this.initEvents();
		}

		this.initObserver();
	}

	private initEvents(): void {
		this.scrollHandler = this.scrollHandler.bind(this);
		window.addEventListener('scroll', this.scrollHandler);

		this.resizeHandler = this.resizeHandler.bind(this);
		window.addEventListener('resize', this.resizeHandler);
	}

	private initObserver(): void {
		if (this.observer !== null) return;

		this.observer = new ResizeObserver(() => {
			this.resizeHandler();
			this.scrollHandler();
		});
		this.observer.observe(this.$container);
	}

	private scrollHandler(): void {
		this.updateDirection();
		this.updateState();
		this.updateIndentTop();
		this.updatePosition();
	}

	private resizeHandler(): void {
		this.updateType();
		this.updateState();
		this.updateIndentTop();
		this.updatePosition();
		this.updateWidthBox('set');
	}

	get getBoxRect(): DOMRect {
		return this.$container.getBoundingClientRect();
	}

	get getTrackRect(): DOMRect {
		return this.$track.getBoundingClientRect();
	}

	get getWindowHeight(): number {
		return document.documentElement.clientHeight;
	}

	get getWindowScrolled(): number {
		return scrollY;
	}

	get getType(): string {
		return this.containerRect.height + this.indentTop + this.indentBottom > this.windowHeight
			? 'smart'
			: 'simple';
	}

	get getDirection(): string {
		return scrollY < this.windowScrolled ? 'up' : 'down';
	}

	get mods(): number {
		return document.querySelector(this.selectorIndent)?.getBoundingClientRect().height || 0;
	}

	get getIndentTop(): number {
		return this.indent.top ? this.indent.top + this.mods : this.mods;
	}

	private updateIndentTop(): void {
		this.indentTop = this.getIndentTop;
	}

	private updateType(): void {
		this.type = this.getType;
	}

	private updateDirection(): void {
		this.direction = this.getDirection;
		this.windowScrolled = scrollY;
	}

	private updateState(): void {
		this.containerRect = this.getBoxRect;
		this.trackRect = this.getTrackRect;
		this.windowHeight = this.getWindowHeight;
	}

	private updateWidthBox(type?: string): void {
		type === 'set'
			? (this.$container.style.width = `${this.trackRect.width}px`)
			: (this.$container.style.width = '');
	}

	private updatePosition(): void {
		const boxBottom = Math.round(this.trackRect.top + this.containerRect.height);
		const maxTopValue = Math.round(boxBottom - this.trackRect.bottom);
		const boxBottomWithWindow = Math.round(boxBottom - this.windowHeight);

		switch (this.type) {
			case 'smart':
				switch (this.direction) {
					case 'down':
						if (boxBottomWithWindow + this.indentBottom > maxTopValue) {
							if (
								Math.round(this.containerRect.bottom) -
									this.windowHeight +
									this.indentBottom <=
								0
							) {
								const topValue =
									this.windowHeight -
									Math.round(this.containerRect.height) -
									this.indentBottom;
								this.sticky(topValue);
								this.tempPosition = Math.round(
									this.indentBottom +
										this.trackRect.top +
										this.containerRect.height -
										this.windowHeight,
								);
							} else {
								this.stop(-this.tempPosition);
							}
						} else {
							this.stop(-maxTopValue);
							this.tempPosition = maxTopValue;
						}
						break;

					case 'up':
						if (Math.round(this.trackRect.top) - this.indentTop < 0) {
							if (Math.round(this.containerRect.top) - this.indentTop >= 0) {
								this.sticky(this.indentTop);
								this.tempPosition = Math.round(this.trackRect.top - this.indentTop);
							} else {
								this.stop(-this.tempPosition);
							}
						} else {
							this.reset();
							this.tempPosition = 0;
						}
						break;
				}
				break;

			case 'simple':
				if (Math.round(this.trackRect.top) - this.indentTop <= 0) {
					Math.round(this.trackRect.top) - this.indentTop <= maxTopValue
						? this.stop(-maxTopValue)
						: this.sticky(this.indentTop);
				} else {
					this.reset();
				}
				break;
		}
	}

	private sticky(topValue: number): void {
		this.$container.classList.add('active');
		this.$container.classList.remove('stop');
		this.$container.style.top = `${topValue}px`;

		this.updateWidthBox('set');
	}

	private stop(topValue: number): void {
		this.$container.classList.add('stop');
		this.$container.classList.remove('active');
		this.$container.style.top = `${topValue}px`;
		this.updateWidthBox();
	}

	private reset(): void {
		this.$container.classList.remove('active');
		this.$container.classList.remove('stop');
		this.$container.style.top = '';

		this.updateWidthBox();
	}
}
