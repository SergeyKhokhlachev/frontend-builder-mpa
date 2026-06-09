import Inputmask from 'inputmask';

export function useAppendMask($element: HTMLInputElement): void {
	const mask: string = $element.dataset.mask;

	switch (mask) {
		case 'date':
			Inputmask('datetime', {
				placeholder: '__.__.____',
				inputFormat: 'dd.mm.yyyy',
			}).mask($element);
			break;

		case 'datetime':
			Inputmask('datetime', {
				placeholder: '__.__.____ __:__',
				inputFormat: 'dd.mm.yyyy HH:MM',
			}).mask($element);
			break;

		case 'tel':
			Inputmask({
				mask: '+7 (999) 999-99-99',
			}).mask($element);
			break;

		default:
			Inputmask({
				mask: mask,
			}).mask($element);
			break;
	}
}
