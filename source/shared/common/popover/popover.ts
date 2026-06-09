import { classInstance, clickOutside } from '@/shared/helpers/helpers';

type PopoverState = {
	position: string;
	top: string;
	left: string;
	width?: string;
};

/**
 * @desc UI Компонент Popover/Tooltip
 * @category 2 Common
 * @example
 * document.querySelectorAll('.js-popover').forEach((element) => {new Popover(element)});
 * @constructor
 * @param {HTMLElement} selector — HTMLElement контейнера
 * @param {Object} [options] — опции конфигурации
 * @param {String} [options.type="popover"] — popover | tooltip (триггер клик или наведение). Если не указан - берется значение атрибута контейнера data-type
 * @param {String} [options.position="right"] — позиция поповера: top | right | bottom | left. Если не указан - берется значение атрибута контейнера data-position
 * @param {String} [options.content] — кнотент поповера. Если не указан - берется значение атрибута контейнера data-content
 *
 */

export class Popover {
	readonly $element: HTMLElement;

	readonly type: string;
	readonly position: string;
	readonly content: string;

	private isActive: boolean;
	protected isHover: boolean;

	protected $popover: HTMLElement;
	protected orders: Array<string>;

	constructor(
		selector: HTMLElement,
		options: {
			type?: string;
			position?: string;
			content?: string;
		} = {},
	) {
		this.$element = selector;

		if (!this.$element) return;

		this.isActive = false;

		this.type = options.type || this.$element.dataset.type || 'popover';
		this.position = options.position || this.$element.dataset.position || 'right';
		this.content = options.content || this.$element.dataset.content || '';

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init(): void {
		classInstance.set(this.$element, { popover: this });

		this.orders = this.getOrder(this.position);

		this.$popover = this.create();
		document.body.appendChild(this.$popover);

		this.isHover = window.matchMedia('(hover: hover)').matches;

		this.changeHandler = this.changeHandler.bind(this);
		window.addEventListener('scroll', this.changeHandler);
		window.addEventListener('resize', this.changeHandler);

		if (this.type === 'popover' || !this.isHover) {
			this.outsideHandler = this.outsideHandler.bind(this);
			document.addEventListener('click', this.outsideHandler);

			this.clickHandler = this.clickHandler.bind(this);
			this.$element.addEventListener('click', this.clickHandler);
		}

		if (this.type === 'tooltip' && this.isHover) {
			this.enterHandler = this.enterHandler.bind(this);
			this.$element.addEventListener('mouseenter', this.enterHandler);

			this.leaveHandler = this.leaveHandler.bind(this);
			this.$element.addEventListener('mouseleave', this.leaveHandler);
		}
	}

	/**
	 * @desc Удалить обрабочики событий
	 */
	public destroy(): void {
		classInstance.del(this.$element, 'popover');

		document.body.removeChild(this.$popover);

		window.removeEventListener('scroll', this.changeHandler);
		window.removeEventListener('resize', this.changeHandler);

		if (this.type === 'popover' || !this.isHover) {
			document.removeEventListener('click', this.outsideHandler);
			this.$element.removeEventListener('click', this.clickHandler);
		}

		if (this.type === 'tooltip' && this.isHover) {
			this.$element.removeEventListener('mouseenter', this.enterHandler);
			this.$element.removeEventListener('mouseleave', this.leaveHandler);
		}
	}

	/**
	 * @desc Переопределить обрабочики событий
	 * @example
	 * const myPopover = app.classInstance.get(document.querySelector('.js-popover'));
	 * myPopover.popover.reinit();
	 */
	public reinit(): void {
		this.destroy();
		this.init();
	}

	/**
	 * @desc Преключить состояние компонента
	 * @param {boolean} key - true - открыть popover, false - закрыть popover
	 * @example
	 * const myPopover = app.classInstance.get(document.querySelector('.js-popover'));
	 * myPopover.popover.toggle(true);
	 */
	public toggle(key: boolean): void {
		if (key) {
			this.$popover.style.display = 'block';
			this.setup();
		}
		this.isActive = key;
		this.$popover.classList.toggle('active', key);
	}

	/**
	 * @desc Изменить контент компонента
	 * @param {string} content - контент компонента, инжектится как innerHTML
	 * @example
	 * const myPopover = app.classInstance.get(document.querySelector('.js-popover'));
	 * myPopover.popover.setContent('Lorem ipsum dolor sit amet <a href="#">consectetur</a> adipisicing elit.');
	 */
	public setContent(content: string): void {
		this.$popover.innerHTML = content;
	}

	private outsideHandler(event: MouseEvent): void {
		const $target: HTMLElement = event.target as HTMLElement;
		if (clickOutside(event, this.$popover) && this.isActive && !this.$element.contains($target))
			this.toggle(false);
	}

	private clickHandler(): void {
		this.toggle(!this.isActive);
	}

	private enterHandler(): void {
		if (!this.isActive) this.toggle(true);
	}

	private leaveHandler(): void {
		if (this.isActive) this.toggle(false);
	}

	private changeHandler(): void {
		if (this.isActive) {
			this.$popover.style.display = 'none';
			this.toggle(false);
		}
	}

	private create(): HTMLElement {
		const $popover: HTMLElement = document.createElement('div');
		$popover.className = 'popover';
		$popover.innerHTML = this.content;
		return $popover;
	}

	private setup(): void {
		for (let index = 0; index < this.orders.length; index++) {
			this.setPosition(this.orders[index]);
			if (this.check()) {
				this.setPosition(this.orders[index]);
				break;
			}
			if (index === this.orders.length - 1 && !this.check()) {
				this.setPosition('fix');
			}
		}
	}

	private check(): boolean {
		const rect: DOMRect = this.$popover.getBoundingClientRect();
		const windowHeight = window.innerHeight || document.documentElement.clientHeight;
		const windowWidth = window.innerWidth || document.documentElement.clientWidth;

		return (
			rect.left >= 0 &&
			rect.top >= 0 &&
			rect.left + rect.width <= windowWidth &&
			rect.top + rect.height <= windowHeight
		);
	}

	private setPosition(position: string): void {
		const popover: DOMRect = this.$popover.getBoundingClientRect();
		const element: DOMRect = this.$element.getBoundingClientRect();
		let state: PopoverState;

		switch (position) {
			case 'fix':
				state = this.getPositionFix(element, popover);
				break;
			case 'left':
				state = this.getPositionLeft(element, popover);
				break;
			case 'right':
				state = this.getPositionRight(element, popover);
				break;
			case 'bottom':
				state = this.getPositionBottom(element, popover);
				break;
			default:
				state = this.getPositionTop(element, popover);
				break;
		}

		this.$popover.dataset.position = state.position;
		this.$popover.style.top = state.top;
		this.$popover.style.left = state.left;
		if (state.width) this.$popover.style.maxWidth = state.width;
	}

	private getOrder(position: string): Array<string> {
		switch (position) {
			case 'left':
				return ['left', 'right', 'top', 'bottom'];
			case 'right':
				return ['right', 'left', 'top', 'bottom'];
			case 'bottom':
				return ['bottom', 'top', 'right', 'left'];
			default:
				return ['top', 'bottom', 'right', 'left'];
		}
	}

	// TODO: position calculation needs to be corrected

	private getPositionFix(element: DOMRect, popover: DOMRect): PopoverState {
		return {
			position: 'top',
			top: `${Math.round(element.top - popover.height - 14)}px`,
			left: `${this.getTransform(element.left, popover.width, element.width)}px`,
			width: `${element.width}px`,
		};
	}

	private getPositionTop(element: DOMRect, popover: DOMRect): PopoverState {
		return {
			position: 'top',
			top: `${Math.round(element.top - popover.height - 14)}px`,
			left: `${this.getTransform(element.left, popover.width, element.width)}px`,
		};
	}

	private getPositionBottom(element: DOMRect, popover: DOMRect): PopoverState {
		return {
			position: 'bottom',
			top: `${Math.round(element.top + element.height + 14)}px`,
			left: `${this.getTransform(element.left, popover.width, element.width)}px`,
		};
	}

	private getPositionLeft(element: DOMRect, popover: DOMRect): PopoverState {
		return {
			position: 'left',
			top: `${this.getTransform(element.top, popover.height, element.height)}px`,
			left: `${Math.round(element.left - popover.width - 14)}px`,
		};
	}

	private getPositionRight(element: DOMRect, popover: DOMRect): PopoverState {
		return {
			position: 'right',
			top: `${this.getTransform(element.top, popover.height, element.height)}px`,
			left: `${Math.round(element.left + element.width + 14)}px`,
		};
	}

	private getTransform(offset: number, popoverSize: number, elementSize: number): number {
		return Math.round(offset - popoverSize / 2 + elementSize / 2);
	}
}
