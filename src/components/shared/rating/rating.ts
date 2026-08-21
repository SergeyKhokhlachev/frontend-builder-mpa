import { classInstance } from '@/common/helpers';

/**
 *  UI Компонент Rating
 * @category 2 Common
 * @example
 * document.querySelectorAll('.js-rating').forEach((element) => {new Rating(element)});
 *
 * @param {HTMLElement} selector - HTMLElement контейнера
 */

export default class Rating {
	readonly $container: HTMLElement;
	readonly $draw: HTMLElement | null = null;
	readonly $items: HTMLInputElement[] = [];

	constructor(selector: HTMLElement) {
		this.$container = selector;

		this.$draw = this.$container.querySelector('.js-rating__draw');
		this.$items = Array.from(this.$container.querySelectorAll('.js-rating__item'));

		this.init();
	}

	/**
	 *  Инициализировать компонент
	 */
	public init() {
		classInstance.set(this.$container, { rating: this });
		this.$items.forEach(($item) => $item.addEventListener('change', this.changeHandler));
	}

	/**
	 *  Удалить обрабочики событий и сбросить состояние
	 */
	public destroy() {
		classInstance.del(this.$container, 'rating');
		this.$items.forEach(($item) => $item.removeEventListener('change', this.changeHandler));
	}

	/**
	 *  Переопределить обрабочики событий
	 * @example
	 * const myRating = app.classInstance.get(document.querySelector('.js-rating'));
	 * myRating.rating.reinit();
	 */
	public reinit() {
		this.destroy();
		this.init();
	}

	private draw(value: string) {
		if (this.$draw) {
			this.$draw.style.width = `${(100 / this.$items.length) * Number(value)}%`;
		}
	}

	private changeHandler = (event: Event) => {
		const target = event.target as HTMLInputElement;
		this.draw(target.value);
		this.dispatchChange(this.$container, target.value);
	};

	private dispatchChange($element: HTMLElement, value: string) {
		$element.dispatchEvent(
			/**
			 *  событие изменения значения компонента.
			 * @category 2 Common
			 * @event Rating#ratingChange
			 * @property {Object} detail.value - значение рейтинга
			 * @example
			 * document.querySelector('.js-rating').addEventListener('ratingChange', (event) => {
			 * 	console.log(event.detail.value);
			 * });
			 */
			new CustomEvent('ratingChange', {
				detail: {
					value: value,
				},
			}),
		);
	}
}
