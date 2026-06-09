import { classInstance } from '@/shared/helpers/helpers';
import { Scrollbar } from '@/shared/common/scrollbar/scrollbar';

/**
 * @desc UI Компонент Modal Element
 * @category 4 Modal
 * @constructor
 * @param {HTMLElement} selector - HTMLElement контейнера
 * @param {Object} [options] - опции конфигурации
 * @param {String} [options.selectorScroll=".js-modal__scroll"] - селектор скролла окна
 * @param {String} [options.selectorContent=".js-modal-content"] - селектор контента окна
 */

export class ModalElement {
	readonly $container: HTMLElement;
	readonly selectorScroll: string;
	readonly selectorContent: string;

	protected scrollbar: InstanceType<typeof Scrollbar>;
	protected $scroll: HTMLElement | null;
	protected $content: HTMLElement | null;

	constructor(
		selector: HTMLElement,
		options: {
			selectorScroll?: string;
			selectorContent?: string;
		} = {},
	) {
		this.$container = selector;

		if (!this.$container) return;

		this.selectorScroll = options.selectorScroll || '.js-modal__scroll';
		this.selectorContent = options.selectorContent || '.js-modal__content';

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init(): void {
		classInstance.set(this.$container, { modal: this });

		this.$scroll = this.$container.querySelector(this.selectorScroll);
		this.$content = this.$container.querySelector(this.selectorContent);

		if (this.$scroll) this.scrollbar = new Scrollbar(this.$scroll);
	}

	/**
	 * @desc Удалить обрабочики событий
	 */
	public destroy(): void {
		classInstance.del(this.$container, 'modal');

		this.scrollbar.destroy();
	}

	/**
	 * @desc Открыть модальное окно
	 * @example
	 * const myModal = app.classInstance.get(document.querySelector('.js-modal'));
	 * myModal.modal.open();
	 */
	public open(): void {
		this.$container.classList.add('active');
		this.dispatchOpen();
	}

	/**
	 * @desc Закрыть модальное окно
	 * @example
	 * const myModal = app.classInstance.get(document.querySelector('.js-modal'));
	 * myModal.modal.close();
	 */
	public close(): void {
		this.$container.classList.remove('active');
		this.dispatchClose();
	}

	/**
	 * @desc Задать контент модального окна
	 * @param {String} content - контент модального окна
	 * @example
	 * const myModal = app.classInstance.get(document.querySelector('.js-modal'));
	 * myModal.modal.content('<p>Some content</p>');
	 */
	public content(content: string): void {
		if (this.$content) this.$content.innerHTML = content;
	}

	private dispatchOpen(): void {
		this.$container.dispatchEvent(
			/**
			 * @desc событие открытия модального окна.
			 * @category 4 Modal
			 * @event ModalElement#modalOpen
			 * @property {Object} detail.modal - контекст экземпляра класса
			 * @example
			 * document.querySelector('.js-modal').addEventListener('modalOpen', (event) => {
			 * 	console.log(event.detail.modal);
			 * });
			 */
			new CustomEvent('modalOpen', {
				detail: {
					modal: this,
				},
			}),
		);
	}

	private dispatchClose(): void {
		this.$container.dispatchEvent(
			/**
			 * @desc событие закрытия модального окна.
			 * @category 4 Modal
			 * @event ModalElement#modalСlose
			 * @property {Object} detail.modal - контекст экземпляра класса
			 * @example
			 * document.querySelector('.js-modal').addEventListener('modalСlose', (event) => {
			 * 	console.log(event.detail.modal);
			 * });
			 */
			new CustomEvent('modalСlose', {
				detail: {
					modal: this,
				},
			}),
		);
	}
}
