import { NotifyElement } from './notify-element/notify-element';

/**
 * @desc UI Компонент Notify
 * @category 5 Notify
 * @example
 * new Notify();
 * @constructor
 * @param {String} [selector=".js-notifyl"] - селектор контейнера, для вывода уведомлений
 */

export class Notify {
	private static _instance: Notify;

	readonly selector: string;
	protected $container: HTMLElement;

	constructor(selector: string) {
		if (Notify._instance) {
			console.warn('the Notify class is a Singleton and already has an instance');
			return Notify._instance;
		}
		Notify._instance = this;

		this.selector = selector || '.js-notify-layer';

		this.$container = document.querySelector(this.selector);

		if (!this.$container) return;

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init(): void {
		Object.assign(window.app, { notify: this });
	}

	/**
	 * @desc Удалить обрабочики событий
	 */
	public destroy(): void {
		delete window.app.notify;
		this.$container.innerHTML = '';
	}

	/**
	 * @desc Переопределить обрабочики событий
	 * @example
	 * const myNotify = app.classInstance.get(document.querySelector('.js-notify'));
	 * myNotify.notify.reinit();
	 */
	public reinit(): void {
		this.destroy();
		this.init();
	}

	/**
	 * @desc Добавить уведомление
	 * @param {Object} [options] - опции конфигурации
	 * @param {String} [options.id] - id уведомления
	 * @param {String} [options.type] - определяет стили уведомления danger | warning | success
	 * @param {Number} [options.delay] - время видимости уведомления в ms, если не указано - уведомление не будет скрыто автоматически
	 * @param {String} [options.content] - контент уведомления, инжектится как innerHTML
	 */
	public append = (
		options: {
			id?: string;
			type?: string;
			delay?: number;
			content?: string;
		} = {},
	): void => {
		const notify = new NotifyElement(this.$container, options);
		notify.open();
	};
}
