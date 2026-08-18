import { classInstance } from '@/common/helpers';
import type { ModalElementOptions, ModalOpenDetail, ModalCloseDetail } from '../modal.types';

/**
 *  UI Компонент Modal Element
 * @category 4 Modal
 *
 * @param {HTMLElement} selector - HTMLElement контейнера
 * @param {Object} [options] - опции конфигурации
 * @param {String} [options.selectorScroll=".js-modal__scroll"] - селектор скролла окна
 * @param {String} [options.selectorContent=".js-modal-content"] - селектор контента окна
 */
export default class ModalElement {
	readonly $container: HTMLElement;
	readonly selectorScroll: string;
	readonly selectorContent: string;

	protected $scroll: HTMLElement | null;
	protected $content: HTMLElement | null;

	constructor(selector: HTMLElement, options: ModalElementOptions = {}) {
		this.$container = selector;

		this.selectorScroll = options.selectorScroll || '.js-modal__scroll';
		this.selectorContent = options.selectorContent || '.js-modal__content';

		this.$scroll = this.$container.querySelector<HTMLElement>(this.selectorScroll);
		this.$content = this.$container.querySelector<HTMLElement>(this.selectorContent);

		this.init();
	}

	/**
	 *  Инициализировать компонент
	 */
	public init() {
		classInstance.set(this.$container, { modal: this });
	}

	/**
	 *  Удалить обрабочики событий и сбросить состояние
	 */
	public destroy() {
		classInstance.del(this.$container, 'modal');
	}

	/**
	 *  Открыть модальное окно
	 * @example
	 * const myModal = app.classInstance.get(document.querySelector('.js-modal'));
	 * myModal.modal.open();
	 */
	public open() {
		this.$container.classList.add('active');
		this.$container.setAttribute('aria-hidden', 'false');
		this.dispatchOpen();
	}

	/**
	 *  Закрыть модальное окно
	 * @example
	 * const myModal = app.classInstance.get(document.querySelector('.js-modal'));
	 * myModal.modal.close();
	 */
	public close() {
		this.$container.classList.remove('active');
		setTimeout(() => this.$container.setAttribute('aria-hidden', 'true'), 1000);
		this.dispatchClose();
	}

	/**
	 *  Задать контент модального окна
	 * @param {String} content - контент модального окна
	 * @example
	 * const myModal = app.classInstance.get(document.querySelector('.js-modal'));
	 * myModal.modal.content('<p>Some content</p>');
	 */
	public content(content: string) {
		if (this.$content) this.$content.innerHTML = content;
	}

	private dispatchOpen() {
		this.$container.dispatchEvent(
			/**
			 *  событие открытия модального окна.
			 * @category 4 Modal
			 * @event ModalElement#modalOpen
			 * @property {Object} detail.modal - контекст экземпляра класса
			 * @example
			 * document.querySelector('.js-modal').addEventListener('modalOpen', (event) => {
			 * 	console.log(event.detail.modal);
			 * });
			 */
			new CustomEvent<ModalOpenDetail>('modalOpen', {
				detail: { modal: this },
			}),
		);
	}

	private dispatchClose() {
		this.$container.dispatchEvent(
			/**
			 *  событие закрытия модального окна.
			 * @category 4 Modal
			 * @event ModalElement#modalСlose
			 * @property {Object} detail.modal - контекст экземпляра класса
			 * @example
			 * document.querySelector('.js-modal').addEventListener('modalСlose', (event) => {
			 * 	console.log(event.detail.modal);
			 * });
			 */
			new CustomEvent<ModalCloseDetail>('modalClose', {
				detail: { modal: this },
			}),
		);
	}
}
