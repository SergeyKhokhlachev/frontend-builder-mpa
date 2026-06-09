import { classInstance } from '@/shared/helpers/helpers';

type Result = {
	days: { value: string; name: string };
	hours: { value: string; name: string };
	minutes: { value: string; name: string };
	seconds: { value: string; name: string };
};

/**
 * @desc UI Компонент Timer
 * @category 2 Common
 * @example
 * const timer = new app.Timer(document.querySelector('.js-timer'), {
		count: '12/22/2024',
		format: (data) =>
			`${data.days.value} ${data.days.name} : 
			 ${data.hours.value} ${data.hours.name} : 
			 ${data.minutes.value} ${data.minutes.name} : 
			 ${data.seconds.value} ${data.seconds.name}`,
	});
	timer.start();
 * @constructor
 * @param {HTMLElement} selector - HTMLElement контейнера
 * @param {Object} [options] - опции конфигурации
 * @param {String} [options.type=date] - отределяет тип входного параметра времени date | number - (Date Time String Format) | (число секунд)
 * @param {String} [options.count] - парметр времени для отсчета
 * @param {Function} [options.format] - функция форматирования вывода счетчика, принемает объект с параметрами даты, возвращает строку для вывода в DOM. Если функция не задана - выводиться кол-во оставшихся секунд
 */

export class Timer {
	readonly $container: HTMLElement;
	readonly format?: (data: Result) => string;

	protected interval: ReturnType<typeof setInterval>;
	protected count: string;
	protected time: number;
	protected type: string;

	constructor(
		selector: HTMLElement,
		options: {
			type?: string;
			count?: string;
			format?: (data: Result) => string;
		} = {},
	) {
		this.$container = selector;

		if (!this.$container) return;

		this.type = options.type || 'date'; // date || number
		this.count = options.count || this.$container.dataset.time;
		this.format = options.format;
		this.interval = null;

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init(): void {
		classInstance.set(this.$container, { timer: this });
	}

	/**
	 * @desc Удалить обрабочики событий
	 */
	public destroy(): void {
		classInstance.del(this.$container, 'timer');
	}

	/**
	 * @desc Установить время
	 * @param {string} time - Строка даты (Date Time String Format) или кол-во секунд
	 * @example
	 * const myTimer = app.classInstance.get(document.querySelector('.js-timer'));
	 * myTimer.timer.set('06/22/2023', 'date');
	 * or
	 * myTimer.timer.set('200', 'number');
	 */
	public set(time: string, type?: string): void {
		if (type) this.type = type;
		const date: Date = new Date();
		if (this.type === 'date') this.time = <any>new Date(time);
		if (this.type === 'number')
			this.time = date.setSeconds(date.getSeconds() + parseInt(time, 10));
	}

	/**
	 * @desc Запустить таймер
	 * @example
	 * const myTimer = app.classInstance.get(document.querySelector('.js-timer'));
	 * myTimer.timer.start();
	 */
	public start(): void {
		this.set(this.count);

		this.interval = <any>setInterval(() => {
			const result: number = this.time - <any>new Date();
			this.render(Timer.calculate(result));
			if (result <= 0) {
				clearInterval(this.interval);
				this.dispatchComplete();
			}
		}, 1000);
	}

	/**
	 * @desc Остановить таймер
	 * @example
	 * const myTimer = app.classInstance.get(document.querySelector('.js-timer'));
	 * myTimer.timer.stop();
	 */
	public stop(): void {
		clearInterval(this.interval);
	}

	/**
	 * @desc Сбросить таймер
	 * @example
	 * const myTimer = app.classInstance.get(document.querySelector('.js-timer'));
	 * myTimer.timer.reset();
	 */
	public reset(): void {
		clearInterval(this.interval);
		this.render(Timer.calculate(this.time));
		this.dispatchReset();
	}

	private render(data: Result): void {
		if (this.format) {
			this.$container.innerHTML = this.format(data);
		} else {
			this.$container.innerHTML = String(data.seconds.value);
		}
	}

	private dispatchComplete(): void {
		this.$container.dispatchEvent(
			/**
			 * @desc событие завершения таймера.
			 * @category 2 Common
			 * @event Timer#timerComplete
			 * @property {Object} detail.timer - контекст экземпляра класса
			 * @example
			 * document.querySelector('.js-timer').addEventListener('timerComplete', (event) => {
			 * 	console.log(event.detail.timer);
			 * });
			 */
			new CustomEvent('timerComplete', {
				detail: {
					timer: this,
				},
			}),
		);
	}

	private dispatchReset(): void {
		this.$container.dispatchEvent(
			/**
			 * @desc событие сброса таймера.
			 * @category 2 Common
			 * @event Timer#timerReset
			 * @property {Object} detail.timer - контекст экземпляра класса
			 * @example
			 * document.querySelector('.js-timer').addEventListener('timerReset', (event) => {
			 * 	console.log(event.detail.timer);
			 * });
			 */
			new CustomEvent('timerReset', {
				detail: {
					timer: this,
				},
			}),
		);
	}

	static declension(num: number, words: Array<string>): string {
		return words[
			num % 100 > 4 && num % 100 < 20 ? 2 : [2, 0, 1, 1, 1, 2][num % 10 < 5 ? num % 10 : 5]
		];
	}

	static generate(
		time: number,
		expression: number,
		declension: Array<string>,
	): { value: string; name: string } {
		const calc = time > 0 ? expression : 0;
		return {
			value: calc < 10 ? `0${calc}` : String(calc),
			name: Timer.declension(calc, declension),
		};
	}

	static calculate(result: number): Result {
		return {
			days: Timer.generate(result, Math.floor(result / 1000 / 60 / 60 / 24), [
				'день',
				'дня',
				'дней',
			]),
			hours: Timer.generate(result, Math.floor(result / 1000 / 60 / 60) % 24, [
				'час',
				'часа',
				'часов',
			]),
			minutes: Timer.generate(result, Math.floor(result / 1000 / 60) % 60, [
				'минута',
				'минуты',
				'минут',
			]),
			seconds: Timer.generate(result, Math.floor(result / 1000) % 60, [
				'секунда',
				'секунды',
				'секунд',
			]),
		};
	}
}
