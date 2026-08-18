import type { NotifyElementOptions } from './notify.types';
import NotifyElement from './notify-element/notify-element';

/**
 * @desc UI Компонент Notify
 * @category 5 Notify
 * @example
 * Notify.getInstance();
 * @constructor
 * @param {String} [selector=".js-notifyl"] - селектор контейнера, для вывода уведомлений
 */

export default class Notify {
	private static _instance: Notify | null = null;

	readonly selector: string;

	protected $container: HTMLElement | null = null;

	private constructor(selector: string = '.js-notify-layer') {
		this.selector = selector;
		this.init();
	}

	/**
	 * @desc Альтернативный статический метод для безопасного получения инстанса
	 */
	public static getInstance(selector: string): Notify {
		if (!Notify._instance) {
			Notify._instance = new Notify(selector);
		} else if (selector) {
			console.warn('The Notify class is a Singleton. New selector ignored.');
		}
		return Notify._instance;
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init() {
		if (window.app) window.app.notify = this;

		this.$container = document.querySelector<HTMLElement>(this.selector);
	}

	/**
	 * @desc Удалить обрабочики событий и сбросить состояние
	 */
	public destroy() {
		if (window.app?.notify) delete window.app.notify;
		if (this.$container) this.$container.innerHTML = '';
		this.$container = null;
	}

	/**
	 * @desc Переопределить обрабочики событий
	 * @example
	 * app.notify.reinit();
	 */
	public reinit() {
		this.destroy();
		this.init();
	}

	/**
	 * @desc Добавить уведомление
	 * @param {Object} [options] - опции конфигурации
	 * @param {String} [options.type] - определяет стили уведомления danger | warning | success, по умолчанию - default
	 * @param {Number} [options.delay] - время видимости уведомления в ms, если не указано - уведомление не будет скрыто автоматически
	 * @param {String} [options.title] - заголовок уведомления
	 * @param {String} [options.text] - текс уведомления
	 * @example
	 * app.notify.append({type: 'success', delay: 3000, text: 'Данные успешно сохранены!'});
	 */
	public append = (options: NotifyElementOptions = {}) => {
		if (this.$container) {
			const notify = new NotifyElement(this.$container, options);
			notify.open();
		} else {
			console.error(`Notify container with selector "${this.selector}" not found in DOM.`);
		}
	};
}
