const digitsCode: Array<string> = [
	'Digit0',
	'Digit1',
	'Digit2',
	'Digit3',
	'Digit4',
	'Digit5',
	'Digit6',
	'Digit7',
	'Digit8',
	'Digit9',
];

export function useGetCode(event: KeyboardEvent): string {
	if (event.code === 'Space') return 'Space';
	if (event.code === 'Backspace') return 'Backspace';
	if (event.code === 'ArrowRight') return 'ArrowRight';
	if (event.code === 'ArrowLeft') return 'ArrowLeft';
	if (digitsCode.includes(event.code)) return 'Digit';
	return '';
}
