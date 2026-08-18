/**
 * @desc UI Компонент Picture
 * @category 2 Common
 * @example
 * document.querySelectorAll('picture.js-picture').forEach((element) => {new Picture(element)});
 * @constructor
 * @param {HTMLPictureElement} selector - HTMLPictureElement
 */

export default class Picture {
	private static observer: IntersectionObserver | null = null;

	readonly $container: HTMLPictureElement;
	readonly $image: HTMLImageElement | null;

	constructor(selector: HTMLPictureElement) {
		this.$container = selector;
		this.$image = this.$container.querySelector('img');

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init() {
		if (!this.$image) return;
		if (this.$image.complete) {
			this.handleLoad();
		} else {
			this.$image.addEventListener('load', this.handleLoad);
		}
		this.observe();
	}

	public destroy() {
		this.$image?.removeEventListener('load', this.handleLoad);
		Picture.getObserver().unobserve(this.$container);
	}

	private observe() {
		Picture.getObserver().observe(this.$container);
	}

	private handleLoad = () => {
		this.$container.classList.add('loaded');
		this.$image?.removeEventListener('load', this.handleLoad);
	};

	private static getObserver(): IntersectionObserver {
		if (!Picture.observer) {
			Picture.observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							const $container = entry.target as HTMLPictureElement;
							Picture.observer?.unobserve($container);
						}
					});
				},
				{
					rootMargin: '200px 0px',
				},
			);
		}
		return Picture.observer;
	}
}
