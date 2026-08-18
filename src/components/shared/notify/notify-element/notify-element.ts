import type { NotifyElementOptions, NotifyType } from '../notify.types';
import { classInstance } from '@/common/helpers';

/**
 * @desc UI Компонент NotifyElement
 * @category 5 Notify
 * @constructor
 * @param {Object} [options] - опции конфигурации
 * @param {String} [options.type] - определяет стили уведомления error | warning | success
 * @param {Number} [options.delay] - время видимости уведомления в ms, если не указано - уведомление не будет скрыто автоматически
 * @param {String} [options.title] - заголовок уведомления
 * @param {String} [options.text] - текс уведомления
 */
export default class NotifyElement {
	readonly $container: HTMLElement;
	readonly $element: HTMLElement;

	readonly type: NotifyType;
	readonly delay: number;
	readonly id: string | null;
	readonly title: string | null;
	readonly text: string | null;

	protected $handle: HTMLElement | null = null;
	protected $closeButton: HTMLButtonElement | null = null;
	protected active: boolean = false;

	private openTimeoutId: number | null = null;
	private closeTimeoutId: number | null = null;

	constructor(container: HTMLElement, options: NotifyElementOptions = {}) {
		this.$container = container;

		this.type = options.type || 'default';
		this.delay = options.delay || 0;
		this.id = options.id || null;
		this.title = options.title || null;
		this.text = options.text || null;

		this.$element = document.createElement('div');
		if (this.id) this.$element.id = this.id;
		this.$element.className = `notify ${options.type}`;

		this.$element.setAttribute('role', options.type === 'error' ? 'alert' : 'status');
		this.$element.setAttribute('aria-live', options.type === 'error' ? 'assertive' : 'polite');

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init() {
		classInstance.set(this.$element, { notify: this });
		this.create();
	}

	/**
	 * @desc Удалить обработчики событий
	 */
	public destroy() {
		classInstance.del(this.$element, 'notify');

		this.$closeButton?.removeEventListener('click', this.closeHandler);

		if (this.openTimeoutId) clearTimeout(this.openTimeoutId);
		if (this.closeTimeoutId) clearTimeout(this.closeTimeoutId);

		this.$element.remove();
		this.$handle = null;
		this.$closeButton = null;
	}

	/**
	 * @desc Открыть уведомление
	 */
	public open() {
		this.$container.prepend(this.$element);

		this.openTimeoutId = window.setTimeout(() => {
			this.active = true;
			this.$element.classList.add('active');

			if (this.delay) {
				const startTime = performance.now();
				requestAnimationFrame((time) => this.processCount(startTime, time));
			}
		}, 300);
	}

	/**
	 * @desc Закрыть уведомление
	 * @example
	 * const myNotify = app.classInstance.get(document.querySelector('#my-notify'));
	 * myNotify.notify.close();
	 */
	public close() {
		this.active = false;
		this.$element.classList.remove('active');
		setTimeout(() => this.destroy(), 300);
	}

	private closeHandler = () => {
		this.close();
	};

	private create() {
		const progress = document.createElement('div');
		progress.className = 'notify__progress';

		const handle = document.createElement('div');
		handle.className = 'notify__handle';

		progress.append(handle);
		this.$handle = handle;

		const button = document.createElement('button');
		button.type = 'button';
		button.className = 'notify__close';
		button.setAttribute('aria-label', 'Закрыть уведомление');
		button.innerHTML = '<i class="icon icon-close notification__close-icon" aria-hidden="true"></i>';

		this.$closeButton = button;

		const content = document.createElement('div');
		content.className = 'notify__content';

		if (this.title) {
			const title = document.createElement('h5');
			title.className = 'notify__title';
			title.textContent = this.title;
			content.append(title);
		}

		if (this.text) {
			const text = document.createElement('div');
			text.className = 'notify__text';
			text.innerHTML = this.text;
			content.append(text);
		}

		this.$element.append(progress);
		this.$element.append(button);
		this.$element.append(content);

		button.addEventListener('click', this.closeHandler);
	}

	private processCount(start: number, time: number) {
		if (!this.active) return;

		const elapsed = time - start;
		const progress = Math.max(0, Math.min(100, (elapsed / this.delay) * 100));

		if (this.$handle) {
			this.$handle.style.transform = `translateX(${progress}%)`;
		}

		if (progress < 100) {
			requestAnimationFrame((nextTime) => this.processCount(start, nextTime));
		} else {
			this.close();
		}
	}
}
