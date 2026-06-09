export function useGetValid(files: Array<File> | null, options: OptionsVE): ResultVE {
	const result: ResultVE = {
		valid: false,
		error: false,
		message: '',
	};

	const validateMessage = window.app.validateMessage;

	if (!options.noEmpty && (!files || files.length === 0)) {
		result.valid = false;
		result.error = true;
		result.message = validateMessage[options.message]['empty'];
	}

	if (files && files.length > 0) {
		result.valid = true;
		result.error = false;
		files.forEach((file) => {
			const extension: string = file.name.split('.').pop().toLowerCase();
			const accept: boolean = options.accept.toLowerCase().includes(extension);
			if (!accept) {
				result.valid = false;
				result.error = true;
				result.message = validateMessage[options.message]['accept'];
				return result;
			}
			if (file.size > options.size) {
				result.valid = false;
				result.error = true;
				result.message = validateMessage[options.message]['size'];
				return result;
			}
		});
	}

	return result;
}
