export function useGetValid($element: HTMLSelectElement, options: OptionsVE): ResultVE {
	const result: ResultVE = {
		valid: false,
		error: false,
		message: '',
	};

	const validateMessage = window.app.validateMessage;

	if (!options.noEmpty) {
		result.valid = false;
		result.error = true;
		Array.from($element.selectedOptions).forEach((option) => {
			if (option.value) {
				result.valid = true;
				result.error = false;
				return;
			}
		});
		result.message = validateMessage[options.message]['empty'];
	}

	return result;
}
