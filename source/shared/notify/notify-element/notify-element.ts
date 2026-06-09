import { classInstance } from '@/shared/helpers/helpers';
/**
 * @desc UI Компонент NotifyElement
 * @category 5 Notify
 * @constructor
 * @param {Object} [options] - опции конфигурации
 * @param {String} [options.id] - id уведомления
 * @param {String} [options.type] - определяет стили уведомления danger | warning | success
 * @param {Number} [options.delay] - время видимости уведомления в ms, если не указано - уведомление не будет скрыто автоматически
 * @param {String} [options.content] - контент уведомления, инжектится как innerHTML
 */
export class NotifyElement {
	readonly $container: HTMLElement;
	readonly $element: HTMLElement;

	readonly id: string;
	readonly type: string;
	readonly delay: number;
	readonly content: string;

	protected $handle: HTMLElement;
	protected isActive: boolean;

	constructor(
		container: HTMLElement,
		options: {
			id?: string;
			type?: string;
			delay?: number;
			content?: string;
		} = {},
	) {
		this.$container = container;

		if (!this.$container) return;

		this.$element = document.createElement('div');
		this.$element.id = options.id;
		this.$element.className = `notify ${options.type}`;

		this.delay = options.delay || 0;
		this.content = options.content || '';

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init(): void {
		classInstance.set(this.$element, { notify: this });
		this.create();
	}

	/**
	 * @desc Удалить обработчики событий
	 */
	public destroy(): void {
		classInstance.del(this.$element, 'notify');
		this.$element.remove();
	}

	/**
	 * @desc Открыть уведомление
	 */
	public open(): void {
		this.$container.prepend(this.$element);
		setTimeout(() => {
			this.isActive = true;
			this.$element.classList.add('active');
			if (this.delay) requestAnimationFrame(this.processCount.bind(this, performance.now()));
		}, 300);
	}

	/**
	 * @desc Закрыть уведомление
	 * @example
	 * const myNotify = app.classInstance.get(document.querySelector('#my-notify'));
	 * myNotify.notify.close();
	 */
	public close(): void {
		this.isActive = false;
		this.$element.classList.remove('active');
		setTimeout(() => this.destroy(), 300);
	}

	private closeHandler(): void {
		this.close();
	}

	private create(): void {
		const progress = document.createElement('div');
		progress.className = 'notify__progress';

		const handle = document.createElement('div');
		handle.className = 'notify__handle';

		progress.append(handle);
		this.$handle = handle;

		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'notify__close';
		button.innerHTML = '<i class="icon icon-close notification__close-icon"></i>';

		const content = document.createElement('div');
		content.className = 'notify__content';
		content.innerHTML = this.content;

		this.$element.append(progress);
		this.$element.append(button);
		this.$element.append(content);

		this.closeHandler = this.closeHandler.bind(this);
		button.addEventListener('click', this.closeHandler);
	}

	private processCount(start: number, time: number): void {
		const process: number = Math.floor((this.delay - (time - start)) / (this.delay / 100));

		if (this.isActive && process > 0) {
			this.$handle.style.transform = `translateX(${100 - process}%)`;
			requestAnimationFrame(this.processCount.bind(this, start));
		}
		if (this.isActive && process <= 0) {
			this.$handle.style.transform = `translateX(100%)`;
			this.close();
		}
	}
}
