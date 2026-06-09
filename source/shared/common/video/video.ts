import { classInstance } from '@/shared/helpers/helpers';

/**
 * @desc UI Компонент Video
 * @category 2 Common
 * @example
 * document.querySelectorAll('.js-video').forEach((element) => {new Video(element)});
 * @constructor
 * @param {HTMLElement} selector - HTMLElement контейнера
 * @param {Object} [options] - опции конфигурации
 * @param {String} [options.selectorButton=".js-video__play"] - селектор элемента воспроизведения
 */

export class Video {
	readonly $container: HTMLElement;
	readonly selectorButton: string;

	protected $button: HTMLElement;
	protected $video: HTMLVideoElement;

	constructor(
		selector: HTMLElement,
		options: {
			selectorButton?: string;
		} = {},
	) {
		this.$container = selector;

		if (!this.$container) return;

		this.selectorButton = options.selectorButton || '.js-video__play';

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init(): void {
		classInstance.set(this.$container, { video: this });

		this.$video = this.$container.querySelector('video');
		this.$button = this.$container.querySelector(this.selectorButton);

		this.clickHandler = this.clickHandler.bind(this);
		this.$button?.addEventListener('click', this.clickHandler);

		this.endedHandler = this.endedHandler.bind(this);
		this.$video?.addEventListener('ended', this.endedHandler);
	}

	/**
	 * @desc Удалить обработчики событий
	 */
	public destroy(): void {
		classInstance.del(this.$container, 'video');

		this.$button?.removeEventListener('click', this.clickHandler);
		this.$video?.removeEventListener('ended', this.endedHandler);
	}

	/**
	 * @desc Переопределить обрабочики событий
	 * @example
	 * const myVideo = app.classInstance.get(document.querySelector('.js-video'));
	 * myTabs.video.reinit();
	 */
	public reinit(): void {
		this.destroy();
		this.init();
	}

	/**
	 * @desc Воспроизвести видео
	 * @example
	 * const myVideo = app.classInstance.get(document.querySelector('.js-video'));
	 * myTabs.video.play();
	 */
	public play(): void {
		this.$container.classList.add('active');
		this.$video.play();
	}

	/**
	 * @desc Остановить воспроизведение видео
	 * @example
	 * const myVideo = app.classInstance.get(document.querySelector('.js-video'));
	 * myTabs.video.pause();
	 */
	public pause(): void {
		this.$video.pause();
	}

	private clickHandler(): void {
		this.play();
	}

	private endedHandler(): void {
		this.ended();
	}

	private ended(): void {
		this.$container.classList.remove('active');
	}
}
