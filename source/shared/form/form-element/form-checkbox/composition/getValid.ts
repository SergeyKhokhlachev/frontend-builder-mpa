export function useGetValid($element: HTMLInputElement, options: OptionsVE): ResultVE {
	const result: ResultVE = {
		valid: false,
		error: false,
		message: '',
	};

	if (!options.noEmpty) {
		const valid = $element.checked;
		result.valid = valid;
		result.error = !valid;
	}

	return result;
}
