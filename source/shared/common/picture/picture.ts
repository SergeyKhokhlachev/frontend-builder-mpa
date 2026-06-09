/**
 * @desc UI Компонент Picture Lazy load
 * @category 2 Common
 * @example
 * document.querySelectorAll('picture.js-lazy').forEach((element) => {new PictureLazy(element)});
 * @constructor
 * @param {HTMLPictureElement} selector - HTMLPictureElement
 */

export class PictureLazy {
	readonly $container: HTMLPictureElement;
	protected $image: HTMLImageElement;

	constructor(selector: HTMLPictureElement) {
		this.$container = selector;

		if (!this.$container) return;

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init(): void {
		this.$image = this.$container.querySelector('img');

		if (this.$image.complete) {
			this.observe();
		} else {
			this.$image.addEventListener('load', () => this.observe());
		}
	}

	private observe(): void {
		const observer = new IntersectionObserver((entries, imgObserver) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					this.load(entry.target);
					imgObserver.unobserve(entry.target);
				}
			});
		});
		observer.observe(this.$container);
	}

	private load($picture: Element): void {
		$picture.classList.add('loaded');
	}
}
