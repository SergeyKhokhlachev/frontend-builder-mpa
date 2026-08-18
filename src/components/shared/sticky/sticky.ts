import { classInstance } from '@/common/helpers';

/**
 * @desc UI Компонент Sticky
 * @category 2 Common
 * @example
 * document.querySelectorAll('.js-sticky').forEach((element) => {new Sticky(element)});
 * @constructor
 * @param {HTMLElement} selector - HTMLElement контейнера
 * @param {Object} [options] - опции конфигурации
 * @param {Number} [options.breakpoint=0] - media брейкпоинт, при ширине экрана меньше брейкпоинта - действие компонента блокируется
 * @param {String} [options.selectorTrack=".js-sticky-track"] - селектор области перемещения
 * @param {String} [options.selectorIndent=".js-sticky-indent"] - селектор блока, высота которого будет добавлена к оступу сверху
 */

type Type = 'simple' | 'smart';
type View = 'sticky' | 'stop' | 'reset';

interface StickyOptions {
	breakpoint?: number;
	selectorTrack?: string;
	selectorIndent?: string;
}

export default class Sticky {
	readonly $element: HTMLElement;
	readonly breakpoint: number;
	readonly selectorTrack: string;
	readonly selectorIndent: string;

	protected $track: HTMLElement | null;
	protected $indent: HTMLElement | null;

	protected status: View = 'reset';
	protected type: Type = 'simple';
	protected indentTop: number = 0;
	protected trackWidth: number = 0;
	protected viewHeight: number = 0;

	protected trackRect: DOMRect | null = null;
	protected elementRect: DOMRect | null = null;

	protected scrolled: number = window.scrollY;
	protected scrollCache: number = 0;
	protected directionCache: 'up' | 'down' = 'down';

	protected mediaQuery: MediaQueryList | null = null;
	protected observer: ResizeObserver | null = null;

	protected elementOutside: number = 0;
	protected simpleTop: number = 0;
	protected simpleBot: number = 0;
	protected smartTop: number = 0;
	protected smartBot: number = 0;

	constructor(selector: HTMLElement, options: StickyOptions = {}) {
		this.$element = selector;

		this.breakpoint = options.breakpoint || 0;

		this.selectorTrack = options.selectorTrack || '.js-sticky-track';
		this.selectorIndent = options.selectorIndent || '.js-sticky-indent';

		this.$track = this.$element.closest(this.selectorTrack);
		this.$indent = document.querySelector(this.selectorIndent);

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init() {
		classInstance.set(this.$element, { sticky: this });

		this.mediaQuery = window.matchMedia(`(width >= ${this.breakpoint}px)`);
		this.mediaQuery.addEventListener('change', this.mediaHandler);
		if (this.mediaQuery.matches) this.enable();
	}

	/**
	 * @desc Удалить обрабочики событий
	 */
	public destroy() {
		classInstance.del(this.$element, 'sticky');

		this.mediaQuery?.removeEventListener('change', this.mediaHandler);
		this.mediaQuery = null;
		this.disable();
	}

	/**
	 * @desc Переопределить обработчики событий
	 * @example
	 * const mySticky = app.classInstance.get(document.querySelector('.js-sticky'));
	 * mySticky.sticky.reinit();
	 */
	public reinit() {
		this.destroy();
		this.init();
	}

	/**
	 * @desc Активировать sticky
	 */
	public enable() {
		this.updateState();
		window.addEventListener('scroll', this.scrollHandler);
		window.addEventListener('resize', this.resizeHandler);

		if (this.observer === null) {
			this.observer = new ResizeObserver(this.observeResize);
			this.observer.observe(this.$element);
		}
	}

	/**
	 * @desc Заблокировать sticky
	 */
	public disable() {
		window.removeEventListener('scroll', this.scrollHandler);
		window.removeEventListener('resize', this.resizeHandler);
		if (this.observer) {
			this.observer.unobserve(this.$element);
			this.observer.disconnect();
			this.observer = null;
		}
		requestAnimationFrame(() => {
			this.updateView('reset');
		});
	}

	private observeResize = () => {
		requestAnimationFrame(() => {
			this.updateState();
			this.updatePosition(this.status === 'stop' ? 'down' : this.directionCache);
		});
	};

	private resizeHandler = () => {
		this.updateState();
		this.updatePosition(this.status === 'stop' ? 'down' : this.directionCache);
	};

	private scrollHandler = () => {
		requestAnimationFrame(() => {
			this.updatePosition(window.scrollY < this.scrolled ? 'up' : 'down');
			this.scrolled = window.scrollY;
		});
	};

	private mediaHandler = (event: MediaQueryListEvent) => {
		if (event.matches) {
			this.enable();
		} else {
			this.disable();
		}
	};

	private updateState() {
		if (!this.$track) return;

		this.indentTop = this.$indent ? this.$indent.offsetHeight : 0;

		this.elementRect = this.$element.getBoundingClientRect();
		this.trackRect = this.$track.getBoundingClientRect();
		this.trackWidth = this.$track.offsetWidth;
		this.viewHeight = document.documentElement.clientHeight;

		this.type = this.$element.clientHeight + this.indentTop > this.viewHeight ? 'smart' : 'simple';

		const elementHeight = this.$element.offsetHeight;
		const trackOffsetTop = this.trackRect.top + window.scrollY;
		const trackOffsetBot = trackOffsetTop + this.$track.offsetHeight - elementHeight;

		if (this.type === 'smart') {
			this.elementOutside = elementHeight - this.viewHeight;
			this.smartTop = trackOffsetTop + this.elementOutside;
			this.smartBot = trackOffsetBot + this.elementOutside;
		}

		if (this.type === 'simple') {
			this.simpleTop = trackOffsetTop - this.indentTop;
			this.simpleBot = trackOffsetBot - this.indentTop;
		}
	}

	private positionSimple() {
		if (window.scrollY >= this.simpleTop && window.scrollY < this.simpleBot) {
			this.updateView('sticky', this.indentTop);
		} else if (window.scrollY >= this.simpleBot) {
			this.updateView('stop', this.simpleBot - this.simpleTop);
		} else {
			this.updateView('stop', 0);
		}
	}

	private positionSmart(direction: 'up' | 'down') {
		if (direction === 'up') {
			if (window.scrollY >= this.smartTop && window.scrollY < this.smartBot - this.indentTop) {
				if (window.scrollY < this.scrollCache) {
					this.updateView('sticky', this.indentTop);
				} else {
					this.updateView('sticky', this.scrollCache - window.scrollY + this.indentTop);
				}
			} else if (window.scrollY < this.smartTop - this.indentTop - this.elementOutside) {
				this.updateView('stop', 0);
			}
		} else {
			if (window.scrollY >= this.smartTop && window.scrollY < this.smartBot - this.elementOutside) {
				if (window.scrollY > this.scrollCache) {
					this.updateView('sticky', -this.elementOutside);
				} else {
					this.updateView('sticky', this.scrollCache - window.scrollY - this.elementOutside);
				}
			} else if (window.scrollY >= this.smartBot) {
				this.updateView('stop', this.smartBot - this.smartTop);
			}
		}
	}

	private updatePosition(direction: 'up' | 'down') {
		if (!this.elementRect) return;

		if (this.directionCache !== direction) {
			this.directionCache = direction;
			if (this.type === 'smart') {
				if (direction === 'up') {
					this.elementRect = this.$element.getBoundingClientRect();
					this.scrollCache = window.scrollY + this.elementRect.top - this.indentTop;
				} else {
					this.scrollCache = window.scrollY + this.elementOutside + this.indentTop;
				}
			}
		}

		if (this.type === 'simple') this.positionSimple();
		if (this.type === 'smart') this.positionSmart(direction);
	}

	private updateView(type: View, top: number = 0) {
		switch (type) {
			case 'sticky':
				this.status = 'sticky';
				this.$element.classList.add('active');
				this.$element.classList.remove('stop');
				this.$element.style.setProperty('--sticky-top', `${Math.round(top)}px`);
				this.$element.style.setProperty('--sticky-width', `${this.trackWidth}px`);
				break;
			case 'stop':
				this.status = 'stop';
				this.$element.classList.add('stop');
				this.$element.classList.remove('active');
				this.$element.style.setProperty('--sticky-top', `${Math.round(top)}px`);
				this.$element.style.setProperty('--sticky-width', 'initial');
				break;
			case 'reset':
				this.status = 'reset';
				this.$element.classList.remove('active', 'stop');
				this.$element.style.setProperty('--sticky-top', 'initial');
				this.$element.style.setProperty('--sticky-width', 'initial');
				break;
		}
	}
}
