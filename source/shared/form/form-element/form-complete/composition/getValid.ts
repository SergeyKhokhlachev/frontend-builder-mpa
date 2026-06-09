import { useValidateRules } from '../../composition/validateRules';

export function useGetValid(
	$element: HTMLInputElement,
	complite: boolean,
	selected: Option | undefined,
	options: OptionsVE,
): ResultVE {
	const result: ResultVE = {
		valid: false,
		error: false,
		message: '',
	};

	const validateMessage = window.app.validateMessage;

	if (!options.noEmpty && $element.value.length === 0) {
		const valid: boolean = useValidateRules['empty'].validate($element);
		result.valid = valid;
		result.error = !valid;
		result.message = validateMessage[options.message]['empty'];
	}

	if (complite) {
		result.valid = true;
		result.error = false;
		return result;
	}

	if ($element.value.length > 0 && !selected) {
		result.valid = false;
		result.error = true;
		result.message = validateMessage[options.message]['entry'];
	}

	if ($element.value.length > 0 && selected && !selected.complete) {
		result.valid = false;
		result.error = true;
		result.message = validateMessage[options.message]['error'];
	}

	if ($element.value.length > 0 && selected && selected.complete) {
		result.valid = true;
		result.error = false;
		result.message = validateMessage[options.message]['error'];
	}

	return result;
}
