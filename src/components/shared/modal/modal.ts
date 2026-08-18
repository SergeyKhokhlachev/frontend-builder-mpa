import type { ModalOptions, ModalRegistry } from './modal.types';
import { classInstance, enableScroll, disableScroll } from '@/common/helpers';
import ModalElement from './modal-element/modal-element';

/**
 * @desc UI Компонент Modal
 * @category 4 Modal
 * @example
 * Modal.getInstance();
 * @constructor
 * @param {Object} [options] - опции конфигурации
 * @param {String} [options.selectorModal=".js-modal"] - селектор модального окна
 * @param {String} [options.selectorOpen=".js-modal-open"] - селектор элемента откывающего окно
 * @param {String} [options.selectorClose=".js-modal-close"] - селектор элемента закрывающего окно
 * @param {String} [options.selectorLayer=".js-modal-layer"] - селектор фонового слоя
 * @param {String} [options.selectorWrapper="body"] - селектор кнотейнера окон
 */

export default class Modal {
	private static _instance: Modal | null = null;

	readonly selectorModal: string;
	readonly selectorOpen: string;
	readonly selectorClose: string;
	readonly selectorLayer: string;
	readonly selectorWrapper: string;

	protected $modal: HTMLElement[] = [];
	protected $open: HTMLElement[] = [];
	protected $close: HTMLElement[] = [];
	protected $layer: HTMLElement | null = null;
	protected $wrapper: HTMLElement | null = null;

	private timers: number[] = [];

	private constructor(options: ModalOptions = {}) {
		this.selectorModal = options.selectorModal || '.js-modal';
		this.selectorOpen = options.selectorOpen || '.js-modal-open';
		this.selectorClose = options.selectorClose || '.js-modal-close';
		this.selectorLayer = options.selectorLayer || '.js-modal-layer';
		this.selectorWrapper = options.selectorWrapper || 'body';

		this.init();
	}

	/**
	 * @desc Альтернативный статический метод для безопасного получения инстанса
	 */
	public static getInstance(options?: ModalOptions): Modal {
		if (!Modal._instance) {
			Modal._instance = new Modal(options);
		} else if (options) {
			console.warn('The Modal class is a Singleton. New options ignored.');
		}
		return Modal._instance;
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init() {
		if (window.app) window.app.modal = this;

		this.$modal = Array.from(document.querySelectorAll(this.selectorModal));
		this.$open = Array.from(document.querySelectorAll(this.selectorOpen));
		this.$close = Array.from(document.querySelectorAll(this.selectorClose));
		this.$layer = document.querySelector(this.selectorLayer);
		this.$wrapper = document.querySelector(this.selectorWrapper);

		const hash: string | undefined = window.location.hash;

		this.$modal.forEach((element) => {
			if (!classInstance.get<ModalRegistry>(element)) {
				new ModalElement(element);
			}

			this.safeDelay(500, () => {
				element.classList.remove('hidden');
			});

			this.safeDelay(1000, () => {
				if (hash === `#${element.id}`) this.open(hash);
			});
		});

		this.$open.forEach((element) => element.addEventListener('click', this.openHandler));
		this.$close.forEach((element) => element.addEventListener('click', this.closeHandler));
		window.addEventListener('keydown', this.escHandler);
	}

	/**
	 * @desc Удалить обработчики событий
	 */
	public destroy() {
		if (window.app?.modal) delete window.app.modal;

		this.$open.forEach((element) => element.removeEventListener('click', this.openHandler));
		this.$close.forEach((element) => element.removeEventListener('click', this.closeHandler));
		window.removeEventListener('keydown', this.escHandler);

		this.timers.forEach((timer) => clearTimeout(timer));
		this.timers = [];
	}

	/**
	 * @desc Переопределить обрабочики событий
	 * @example
	 * app.modal.reinit();
	 */
	public reinit() {
		this.destroy();
		this.init();
	}

	/**
	 * @desc Открыть модальное окно
	 * @param {String} modalId - id модального окна
	 * @example
	 * app.modal.open('#modal-base');
	 */
	public open(modalId: string) {
		const $targetElement = document.querySelector<HTMLElement>(modalId);
		if (!$targetElement) return;

		const $activeElement = document.querySelector<HTMLElement>(`${this.selectorModal}.active`);

		const $modalActive = $activeElement ? classInstance.get<ModalRegistry>($activeElement) : undefined;
		const $modalTarget = classInstance.get<ModalRegistry>($targetElement);

		this.$layer?.classList.add('active');

		$modalActive?.modal.close();
		$modalTarget?.modal.open();

		if (!$modalActive) disableScroll();
	}

	/**
	 * @desc Закрыть модальное окно
	 * @example
	 * app.modal.close();
	 */
	public close() {
		const $activeElement = document.querySelector<HTMLElement>(`${this.selectorModal}.active`);
		if (!$activeElement) return;

		const $modalActive = classInstance.get<ModalRegistry>($activeElement);

		if ($modalActive) {
			$modalActive.modal.close();
			this.$layer?.classList.remove('active');
			enableScroll();
		}
	}

	/**
	 * @desc Задать контент модального окна
	 * @param {String} modalId - id модального окна
	 * @param {String} content - контент модального окна
	 * @example
	 * app.modal.content('#modal-base', '<p>Some content</p>');
	 */
	public content(modalId: string, content: string) {
		const $targetElement = document.querySelector<HTMLElement>(modalId);
		if (!$targetElement) return;

		const $modalTarget = classInstance.get<ModalRegistry>($targetElement);
		$modalTarget?.modal.content(content);
	}

	private openHandler = (event: MouseEvent) => {
		event.preventDefault();
		const $target = event.currentTarget as HTMLElement; // Безопасный захват кнопки-родителя
		const modal = $target.dataset.modal || $target.getAttribute('href');

		if (modal) this.open(modal);
	};

	private closeHandler = () => {
		this.close();
	};

	private escHandler = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			this.close();
		}
	};

	private safeDelay(ms: number, callback: () => void) {
		const timer = window.setTimeout(callback, ms);
		this.timers.push(timer);
	}
}
