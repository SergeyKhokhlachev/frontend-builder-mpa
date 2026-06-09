import { classInstance } from '@/shared/helpers/helpers';

import SimpleBar from 'simplebar';
import 'simplebar/dist/simplebar.min.css';

/**
 * @desc UI Компонент Scrollbar
 * @category 2 Common
 * @example
 * document.querySelectorAll('.js-scrollbar').forEach((element) => {new Scrollbar(element)});
 * @constructor
 * @param {HTMLElement} selector - HTMLElement контейнера
 * @param {Object} [options] - опции конфигурации
 * @param {String} [options.autoHide=false] - скрывает полосу прокрутки, если пользователь не прокручивает ее.
 * @param {String} [options.minSize=10] - минимальный размер полосы прокрутки в пикселях.
 */

export class Scrollbar {
	readonly $container: HTMLElement;
	readonly autoHide: boolean;
	readonly minSize: number;

	protected scrollbar: InstanceType<typeof SimpleBar>;

	constructor(
		selector: HTMLElement,
		options: {
			autoHide?: boolean;
			minSize?: number;
		} = {},
	) {
		this.$container = selector;

		if (!this.$container) return;

		this.autoHide = options.autoHide || false;
		this.minSize = options.minSize || 10;

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init(): void {
		classInstance.set(this.$container, { scrollbar: this });

		this.scrollbar = new SimpleBar(this.$container, {
			autoHide: this.autoHide,
			scrollbarMinSize: this.minSize,
		});
	}

	/**
	 * @desc Удалить обрабочики событий
	 */
	public destroy(): void {
		classInstance.del(this.$container, 'scrollbar');
	}

	/**
	 * @desc Пересчитать полосы прокрутки
	 * @example
	 * const myScrollbar = app.classInstance.get(document.querySelector('.js-scrollbar'));
	 * myScrollbar.scrollbar.recalculate();
	 */
	public recalculate(): void {
		this.scrollbar.recalculate();
	}
}
