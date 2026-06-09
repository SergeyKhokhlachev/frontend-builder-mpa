function setFocus(element: HTMLInputElement): void {
	setTimeout(() => {
		if (element.value) {
			element.selectionStart = 1;
			element.selectionEnd = 1;
		}
		element.focus();
	});
}

export function useSetTarget(
	list: Array<HTMLInputElement>,
	current: HTMLInputElement,
	derection: number,
): void {
	const index: number = list.indexOf(current);
	if (derection > 0 && index + 1 < list.length) setFocus(list[index + 1]);
	if (derection < 0 && index - 1 >= 0) setFocus(list[index - 1]);
}
