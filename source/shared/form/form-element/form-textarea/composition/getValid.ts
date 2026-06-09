import { useValidateRules } from '../../composition/validateRules';

export function useGetValid(
	$element: HTMLInputElement | HTMLTextAreaElement,
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

	if ($element.value.length > 0) {
		const valid: boolean = useValidateRules[options.rule].validate($element);
		result.valid = valid;
		result.error = !valid;
		result.message = validateMessage[options.message]['error'];
	}

	return result;
}
