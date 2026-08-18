import Timer from '@/components/shared/timer/timer';

export type TimerType = 'date' | 'number';

interface TimerOption {
	value: string;
	name: string;
}

export interface TimerResult {
	days: TimerOption | null;
	hours: TimerOption | null;
	minutes: TimerOption | null;
	seconds: TimerOption | null;
}

export interface TimerResetDetail {
	timer: Timer;
}

export interface TimerCompleteDetail {
	timer: Timer;
}

export type TimerResetEvent = CustomEvent<TimerResetDetail>;
export type TimerCompleteEvent = CustomEvent<TimerCompleteDetail>;

declare global {
	interface HTMLElementEventMap {
		timerReset: TimerResetEvent;
		timerComplete: TimerCompleteEvent;
	}
}
