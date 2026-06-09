export function useGetValue(elements: NodeListOf<HTMLInputElement>): string {
	let value = '';
	elements.forEach((element) => {
		value += element.value;
	});
	return value;
}
