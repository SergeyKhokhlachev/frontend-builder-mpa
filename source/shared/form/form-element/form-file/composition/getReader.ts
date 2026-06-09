export async function useGetReader(files: Array<File>): Promise<Array<ReaderEll>> {
	const result: Array<ReaderEll> = [];

	function setItem(file: File): Promise<ReaderEll> {
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onload = (event) => {
				resolve({
					name: file.name,
					src: event.target.result,
					ext: file.name.split('.').pop().toLowerCase(),
					img: file.type.toLowerCase().includes('image'),
				});
			};

			reader.onerror = (event) => {
				console.warn(event);
			};

			reader.readAsDataURL(file);
		});
	}

	function setFragment(files: Array<File>) {
		return Promise.all(files.map((file) => setItem(file)));
	}

	await setFragment(files).then((files) => {
		files.forEach((item) => {
			result.push(item);
		});
	});

	return result;
}
