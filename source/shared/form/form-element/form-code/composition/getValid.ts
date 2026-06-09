export function useGetValid(
	$element: HTMLInputElement,
	length: number,
	options: OptionsVE,
): ResultVE {
	const result: ResultVE = {
		valid: false,
		error: false,
		message: '',
	};

	const validateMessage = window.app.validateMessage;

	if (!options.noEmpty && $element.value.length === 0) {
		result.valid = false;
		result.error = true;
		result.message = validateMessage[options.message]['empty'];
	}

	if ($element.value.length) {
		if ($element.value.length === length) {
			result.valid = true;
			result.error = false;
		} else {
			result.valid = false;
			result.error = true;
			result.message = validateMessage[options.message]['error'];
		}
	}

	return result;
}
