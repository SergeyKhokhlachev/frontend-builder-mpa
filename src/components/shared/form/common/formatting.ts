export const getFormatPhone = (value: string): string => {
	let digits = value.replace(/\D/g, '');

	if (digits.startsWith('8')) {
		digits = '7' + digits.substring(1);
	} else if (!digits.startsWith('7') && digits.length > 0) {
		digits = '7' + digits;
	}

	digits = digits.substring(0, 11);

	if (digits.length === 0) return '';

	let formatted = '+7';

	if (digits.length > 1) {
		formatted += ' (' + digits.substring(1, 4);
	}
	if (digits.length >= 5) {
		formatted += ') ' + digits.substring(4, 7);
	}
	if (digits.length >= 8) {
		formatted += '-' + digits.substring(7, 9);
	}
	if (digits.length >= 10) {
		formatted += '-' + digits.substring(9, 11);
	}

	return formatted;
};
