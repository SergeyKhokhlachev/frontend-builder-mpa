import type { TimerType, TimerResult, TimerResetDetail, TimerCompleteDetail } from '@/components/shared/timer/timer.types';

/**
 *  UI Компонент Timer
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
 *
 * @param {HTMLElement} selector - HTMLElement контейнера
 * @param {Object} [options] - опции конфигурации
 * @param {String} [options.count] - парметр времени для отсчета, строка даты (Date Time String Format) или кол-во секунд
 * @param {String} [options.type=date] - отределяет тип входного параметра времени date | number - (Date Time String Format) | (число секунд)
 * @param {Function} [options.format] - функция форматирования вывода счетчика, принемает объект с параметрами даты, возвращает строку для вывода в DOM. Если функция не задана - выводиться кол-во оставшихся секунд
 */
export default class Timer {
	readonly $container: HTMLElement;
	readonly format?: (data: TimerResult) => string;

	protected count: string | number;
	protected type: TimerType;

	protected time: number = 0;
	protected current: number = 0;
	protected frame: number | null = null;

	constructor(
		selector: HTMLElement,
		options: {
			count?: string | number;
			type?: TimerType;
			format?: (data: TimerResult) => string;
		} = {},
	) {
		this.$container = selector;

		this.count = options.count || this.$container.dataset.time || 0;
		this.type = options.type || 'date';
		this.format = options.format;
	}

	/**
	 *  Удалить обрабочики событий и сбросить состояние
	 */
	public destroy(): void {
		this.stop();
	}

	/**
	 *  Установить время
	 * @param {string} count - Строка даты (Date Time String Format) или кол-во секунд
	 * @example
	 * const myTimer = app.classInstance.get(document.querySelector('.js-timer'));
	 * myTimer.timer.set('06/22/2023', 'date');
	 * or
	 * myTimer.timer.set('200', 'number');
	 */
	public set(count: string | number, type: TimerType = this.type): void {
		if (type) this.type = type;

		if (this.type === 'date') {
			this.time = new Date(count).getTime();
		}

		if (this.type === 'number') {
			this.time = Date.now() + Number(count) * 1000;
		}
	}

	/**
	 *  Запустить таймер
	 * @example
	 * const myTimer = app.classInstance.get(document.querySelector('.js-timer'));
	 * myTimer.timer.start();
	 */
	public start(): void {
		this.set(Math.floor(this.current / 1000) || this.count);
		if (!this.frame) this.animate();
	}

	/**
	 *  Остановить таймер
	 * @example
	 * const myTimer = app.classInstance.get(document.querySelector('.js-timer'));
	 * myTimer.timer.stop();
	 */
	public stop(): void {
		if (this.frame) {
			cancelAnimationFrame(this.frame);
			this.frame = null;
		}
	}

	/**
	 *  Сбросить таймер
	 * @example
	 * const myTimer = app.classInstance.get(document.querySelector('.js-timer'));
	 * myTimer.timer.reset();
	 */
	public reset(): void {
		this.stop();
		this.set(this.count);
		this.render(this.calculated(this.time - Date.now()));
		this.dispatchReset();
		this.current = 0;
	}

	private calculated(ms: number): TimerResult {
		return this.type === 'date' ? this.calculateDate(ms) : this.calculateNumber(ms);
	}

	private animate() {
		this.current = this.time - Date.now();
		this.render(this.calculated(this.current));

		if (this.current <= 0) {
			this.stop();
			this.dispatchComplete();
		} else {
			this.frame = requestAnimationFrame(() => this.animate());
		}
	}

	private render(data: TimerResult): void {
		if (this.format) {
			this.$container.textContent = this.format(data);
		} else {
			this.$container.textContent = String(data.seconds?.value || '00');
		}
	}

	private declension(num: number, words: Array<string>): string {
		return words[num % 100 > 4 && num % 100 < 20 ? 2 : [2, 0, 1, 1, 1, 2][num % 10 < 5 ? num % 10 : 5]];
	}

	private generate(time: number, expression: number, declension: Array<string>): { value: string; name: string } {
		const calc = time > 0 ? expression : 0;
		return {
			value: calc < 10 ? `0${calc}` : String(calc),
			name: this.declension(calc, declension),
		};
	}

	private calculateNumber(result: number): TimerResult {
		return {
			days: null,
			hours: null,
			minutes: null,
			seconds: this.generate(result, Math.floor(result / 1000), ['секунду', 'секунды', 'секунд']),
		};
	}

	private calculateDate(result: number): TimerResult {
		return {
			days: this.generate(result, Math.floor(result / 1000 / 60 / 60 / 24), ['день', 'дня', 'дней']),
			hours: this.generate(result, Math.floor(result / 1000 / 60 / 60) % 24, ['час', 'часа', 'часов']),
			minutes: this.generate(result, Math.floor(result / 1000 / 60) % 60, ['минута', 'минуты', 'минут']),
			seconds: this.generate(result, Math.floor(result / 1000) % 60, ['секунда', 'секунды', 'секунд']),
		};
	}

	private dispatchReset(): void {
		this.$container.dispatchEvent(
			/**
			 *  событие сброса таймера.
			 * @category 2 Common
			 * @event Timer#timerReset
			 * @property {Object} detail.timer - контекст экземпляра класса
			 * @example
			 * document.querySelector('.js-timer').addEventListener('timerReset', (event) => {
			 * 	console.log(event.detail.timer);
			 * });
			 */
			new CustomEvent<TimerResetDetail>('timerReset', {
				detail: { timer: this },
			}),
		);
	}

	private dispatchComplete(): void {
		this.$container.dispatchEvent(
			/**
			 *  событие завершения таймера.
			 * @category 2 Common
			 * @event Timer#timerComplete
			 * @property {Object} detail.timer - контекст экземпляра класса
			 * @example
			 * document.querySelector('.js-timer').addEventListener('timerComplete', (event) => {
			 * 	console.log(event.detail.timer);
			 * });
			 */
			new CustomEvent<TimerCompleteDetail>('timerComplete', {
				detail: { timer: this },
			}),
		);
	}
}
