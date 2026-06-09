import { classInstance } from '@/shared/helpers/helpers';

/**
 * @desc Функция валидации формы
 * @category 3 Form
 * @param {HTMLFormElement} $form - HTMLFormElement формы
 * @param {boolean} noRender - если передать true - представление не будет обновляться
 * @returns {object} { valid: boolean, looked: boolean }
 */
export function useValidate($form: HTMLFormElement, noRender?: boolean): ResultVF {
	const result: ResultVF = {
		valid: true,
		looked: false,
	};

	$form.querySelectorAll('[required]').forEach(($element: HTMLFormElement) => {
		const look: string | undefined = $element.dataset.look;
		const element = classInstance.get($element);
		const valid: boolean = element?.formElement.validate({ noRender: noRender });
		if (!valid) result.valid = false;
		if (look === 'true' && !valid) result.looked = true;
	});

	return result;
}
