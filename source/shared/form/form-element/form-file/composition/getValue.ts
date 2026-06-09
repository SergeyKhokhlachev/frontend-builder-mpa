export function useGetValue(
	files: FileList,
	value: Array<File>,
	length: number,
	multiple: boolean,
): Array<File> {
	if (multiple) {
		const list = [...value, ...Array.from(files)];
		return list.filter((file, index) => index < length);
	} else {
		return [files[0]];
	}
}
