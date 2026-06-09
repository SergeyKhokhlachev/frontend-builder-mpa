export function useCheckDigit(value: string): boolean {
	return /^(0|[1-9]\d*)$/.test(value);
}
