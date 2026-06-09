import { classInstance } from '@/shared/helpers/helpers';

type TabsState = {
	$activeButton: HTMLElement | undefined;
	$activeContent: HTMLElement | undefined;
	$targetButton: HTMLElement | undefined;
	$targetContent: HTMLElement | undefined;
	exists: boolean;
};

/**
 * @desc UI Компонент Tabs
 * @category 2 Common
 * @example
 * document.querySelectorAll('.js-tabs').forEach((element) => {new Tabs(element)});
 * @constructor
 * @param {HTMLElement} selector - HTMLElement контейнера
 * @param {Object} [options] - опции конфигурации
 * @param {String} [options.duration=200] - шаг выполнения анимации
 * @param {String} [options.selectorButton=".js-tabs__button"] - селектор кнопки элемента компонента
 * @param {String} [options.selectorContent=".js-tabs__content"] - селектор контента элемента компонента
 * @param {String} [options.selectorWrapper=".js-tabs__wrapper"] - селектор обертки контента элементов компонента
 */

export class Tabs {
	readonly $container: HTMLElement;
	readonly selectorButton: string;
	readonly selectorContent: string;
	readonly selectorWrapper: string;
	readonly duration: number;

	protected $buttons: Array<HTMLElement>;
	protected $contents: Array<HTMLElement>;
	protected $wrapper: HTMLElement | null;
	protected state: TabsState;
	private range: number;
	private height: number;

	constructor(
		selector: HTMLElement,
		options: {
			duration?: number;
			selectorButton?: string;
			selectorContent?: string;
			selectorWrapper?: string;
		} = {},
	) {
		this.$container = selector;

		if (!this.$container) return;

		this.duration = options.duration || 300;
		this.selectorButton = options.selectorButton || '.js-tabs__button';
		this.selectorContent = options.selectorContent || '.js-tabs__content';
		this.selectorWrapper = options.selectorWrapper || '.js-tabs__wrapper';

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init(): void {
		classInstance.set(this.$container, { tabs: this });
		this.$buttons = Array.from(this.$container.querySelectorAll(this.selectorButton));
		this.$contents = Array.from(this.$container.querySelectorAll(this.selectorContent));
		this.$wrapper = this.$container.querySelector(this.selectorWrapper);

		const $button = this.$buttons.find((element) => element.classList.contains('active'));
		this.$contents.forEach(($content) => {
			if ($content.dataset.tab === $button.dataset.tab) {
				$content.classList.add('active');
				$content.style.opacity = '1';
			} else {
				$content.style.opacity = '0';
			}
		});

		this.clickHandler = this.clickHandler.bind(this);
		this.$buttons.forEach(($button) => $button.addEventListener('click', this.clickHandler));
	}

	/**
	 * @desc Удалить обработчики событий
	 */
	public destroy(): void {
		classInstance.del(this.$container, 'tabs');
		this.$buttons.forEach(($button) => $button.removeEventListener('click', this.clickHandler));
	}

	/**
	 * @desc Переопределить обрабочики событий
	 * @example
	 * const myTabs = app.classInstance.get(document.querySelector('.js-tabs'));
	 * myTabs.tabs.reinit();
	 */
	public reinit(): void {
		this.destroy();
		this.init();
	}

	/**
	 * @desc Открыть элемент компонента
	 * @param {String} tab - атрибут data-tab элемента компонента
	 */
	public open(tab: string): void {
		this.state = this.getState(tab);
		if (this.state.exists && this.$wrapper) {
			this.prepareHide();
			requestAnimationFrame(
				this.processHide.bind(this, performance.now(), () => {
					this.prepareShow();
					requestAnimationFrame(
						this.processShow.bind(this, performance.now(), () => {
							this.dispatchShown(this.state.$targetContent);
						}),
					);
				}),
			);
		}
	}

	private clickHandler(event: MouseEvent): void {
		const target: HTMLElement = event.target as HTMLElement;
		const button: HTMLElement | null = target.closest(this.selectorButton);
		const tab: string | undefined = button?.dataset.tab;
		if (tab) this.open(tab);
	}

	private prepareShow(): void {
		this.state.$activeButton.classList.remove('active');
		this.state.$activeContent.classList.remove('active');
		this.state.$targetButton.classList.add('active');
		this.state.$targetContent.classList.add('active');
	}

	private prepareHide(): void {
		this.state.$targetContent.classList.add('active');
		this.range = this.state.$activeContent.scrollHeight - this.state.$targetContent.scrollHeight;
		this.height = this.state.$activeContent.scrollHeight;
		this.state.$targetContent.classList.remove('active');
		this.$wrapper.style.height = `${this.height}px`;
	}

	private processShow(start: number, callback: () => void, time: number): void {
		const process = Math.min((time - start) / this.duration, 1);

		if (process < 1) {
			this.state.$targetContent.style.opacity = String(process);
			if (this.range > 0) {
				this.$wrapper.style.height = `${this.height - process * this.range}px`;
			}
			requestAnimationFrame(this.processShow.bind(this, start, callback));
		} else {
			this.state.$targetContent.style.opacity = '1';
			this.$wrapper.style.height = 'auto';
			callback();
		}
	}

	private processHide(start: number, callback: () => void, time: number): void {
		const process = Math.min((time - start) / this.duration, 1);

		if (process < 1) {
			this.state.$activeContent.style.opacity = String(1 - process);
			if (this.range < 0) {
				this.$wrapper.style.height = `${this.height + process * Math.abs(this.range)}px`;
			}
			requestAnimationFrame(this.processHide.bind(this, start, callback));
		} else {
			this.state.$activeContent.style.opacity = '0';
			if (this.range < 0) this.$wrapper.style.height = 'auto';
			callback();
		}
	}

	private getState(tab: string): TabsState {
		const state: TabsState = {
			$activeButton: this.$buttons.find((element) => element.classList.contains('active')),
			$activeContent: this.$contents.find((element) => element.classList.contains('active')),
			$targetButton: this.$buttons.find((element) => element.dataset.tab === tab),
			$targetContent: this.$contents.find((element) => element.dataset.tab === tab),
			exists: false,
		};

		state.exists = !!(
			state.$activeButton &&
			state.$activeContent &&
			state.$targetButton &&
			state.$targetContent
		);

		return state;
	}

	private dispatchShown(element: HTMLElement): void {
		element.dispatchEvent(
			/**
			 * @desc событие открытия элемента компонента.
			 * @category 2 Common
			 * @event Tabs#tabShown
			 * @property {Object} detail.tabs - контекст экземпляра класса
			 * @example
			 * document.querySelector('.js-tabs__content').addEventListener('tabShown', (event) => {
			 * 	console.log(event.detail.tabs);
			 * });
			 */
			new CustomEvent('tabShown', {
				detail: {
					tabs: this,
				},
			}),
		);
	}
}
