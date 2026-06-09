import { classInstance } from '@/shared/helpers/helpers';
import { ModalElement } from './modal-element/modal-element';

/**
 * @desc UI Компонент Modal
 * @category 4 Modal
 * @example
 * new Modal();
 * @constructor
 * @param {Object} [options] - опции конфигурации
 * @param {String} [options.selectorModal=".js-modal"] - селектор модального окна
 * @param {String} [options.selectorOpen=".js-modal-open"] - селектор элемента откывающего окно
 * @param {String} [options.selectorClose=".js-modal-close"] - селектор элемента закрывающего окно
 * @param {String} [options.selectorLayer=".js-modal-layer"] - селектор фонового слоя
 * @param {String} [options.selectorWrapper="body"] - селектор кнотейнера окон
 */

export class Modal {
	private static _instance: Modal;
	readonly selectorModal: string;
	readonly selectorOpen: string;
	readonly selectorClose: string;
	readonly selectorLayer: string;
	readonly selectorWrapper: string;

	protected $modal: Array<HTMLElement>;
	protected $open: Array<HTMLElement>;
	protected $close: Array<HTMLElement>;
	protected $layer: HTMLElement | null;
	protected $wrapper: HTMLElement | null;

	constructor(
		options: {
			selectorModal?: string;
			selectorOpen?: string;
			selectorClose?: string;
			selectorLayer?: string;
			selectorWrapper?: string;
		} = {},
	) {
		if (Modal._instance) {
			console.warn('the Modal class is a Singleton and already has an instance');
			return Modal._instance;
		}
		Modal._instance = this;

		this.selectorModal = options.selectorModal || '.js-modal';
		this.selectorOpen = options.selectorOpen || '.js-modal-open';
		this.selectorClose = options.selectorClose || '.js-modal-close';
		this.selectorLayer = options.selectorLayer || '.js-modal-layer';
		this.selectorWrapper = options.selectorWrapper || 'body';

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init(): void {
		Object.assign(window.app, { modal: this });
		this.$modal = Array.from(document.querySelectorAll(this.selectorModal));
		this.$open = Array.from(document.querySelectorAll(this.selectorOpen));
		this.$close = Array.from(document.querySelectorAll(this.selectorClose));

		this.$layer = document.querySelector(this.selectorLayer);
		this.$wrapper = document.querySelector(this.selectorWrapper);

		const hash: string | undefined = window.location.hash;

		this.$modal.forEach((element) => {
			new ModalElement(element);
			this.await(500).then(() => {
				element.classList.remove('hidden');
			});
			this.await(1000).then(() => {
				if (hash === `#${element.id}`) this.open(hash);
			});
		});

		this.openHandler = this.openHandler.bind(this);
		this.$open.forEach((element) => element.addEventListener('click', this.openHandler));

		this.closeHandler = this.closeHandler.bind(this);
		this.$close.forEach((element) => element.addEventListener('click', this.closeHandler));
	}

	/**
	 * @desc Удалить обработчики событий
	 */
	public destroy(): void {
		delete window.app.modal;
		this.$open.forEach((element) => element.removeEventListener('click', this.openHandler));
		this.$close.forEach((element) => element.removeEventListener('click', this.closeHandler));
	}

	/**
	 * @desc Переопределить обрабочики событий
	 * @example
	 * app.modal.reinit();
	 */
	public reinit(): void {
		this.destroy();
		this.init();
	}

	/**
	 * @desc Открыть модальное окно
	 * @param {String} modal - селектор модального окна
	 * @example
	 * app.modal.open('#modal-base');
	 */
	public open(modal: string): void {
		const $activeWindow: any = classInstance.get(
			document.querySelector(`${this.selectorModal}.active`),
		);
		const $modalWindow: any = classInstance.get(document.querySelector(modal));

		this.$layer?.classList.add('active');
		this.$wrapper?.classList.add('modal-open');

		$activeWindow?.modal.close();
		$modalWindow?.modal.open();
	}

	/**
	 * @desc Закрыть модальное окно
	 * @example
	 * app.modal.close();
	 */
	public close(): void {
		const $modalElement: any = classInstance.get(
			document.querySelector(`${this.selectorModal}.active`),
		);

		$modalElement?.modal.close();

		this.$layer?.classList.remove('active');
		this.$wrapper?.classList.remove('modal-open');
	}

	/**
	 * @desc Задать контент модального окна
	 * @param {String} modal - селектор модального окна
	 * @param {String} content - контент модального окна
	 * @example
	 * app.modal.content('#modal-base', '<p>Some content</p>');
	 */
	public content(modal: string, content: string): void {
		const modalElement: any = classInstance.get(document.querySelector(modal));
		modalElement?.modal.content(content);
	}

	private openHandler(event: MouseEvent): void {
		event.preventDefault();
		const $target: HTMLElement = event.target as HTMLElement;
		const $button: HTMLElement | null = $target.closest(this.selectorOpen);
		const modal: string | null | undefined =
			$button?.dataset.modal || $button?.getAttribute('href');
		if (modal) this.open(modal);
	}

	private closeHandler(): void {
		this.close();
	}

	private await(ms: number): Promise<number> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}
