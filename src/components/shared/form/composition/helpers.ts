import { rules } from '@/components/shared/form/composition/rules';
import { messages } from '@/components/shared/form/composition/messages';

import type { ResultValidate, ViewFileOptions } from '@/components/shared/form/form.types';

export function getValidateInput(
	rule: string,
	message: string,
	value: string,
	empty: boolean,
	required: boolean,
): ResultValidate {
	let viewResult: ResultValidate;
	const isValueEmpty = !value.trim().length;

	if (!required && isValueEmpty) {
		viewResult = { valid: true, error: false, complete: false, message: '' };
		return viewResult;
	}

	const ruleComputed = rules[rule];
	const messageComputed = messages[message];
	if (!ruleComputed) console.warn(`Rule "${rule}" not found in validation rules.`);
	if (!messageComputed) console.warn(`Rule "${message}" not found in validation messages.`);

	const isValid = ruleComputed ? ruleComputed.validate(value) : true;

	if (isValueEmpty) {
		if (empty) {
			viewResult = { valid: isValid, error: false, complete: false, message: '' };
		} else {
			viewResult = { valid: isValid, error: !isValid, complete: isValid, message: messageComputed?.empty || '' };
		}
	} else {
		viewResult = { valid: isValid, error: !isValid, complete: isValid, message: messageComputed?.error || '' };
	}
	return viewResult;
}

export function getValidateSelect(message: string, checked: boolean, empty: boolean, required: boolean): ResultValidate {
	let viewResult: ResultValidate;

	if (!required) {
		viewResult = { valid: true, error: false, complete: false, message: '' };
		return viewResult;
	}

	const messageComputed = messages[message];
	if (!messageComputed) console.warn(`Rule "${message}" not found in validation messages.`);

	const isValid = checked;

	if (empty) {
		viewResult = { valid: isValid, error: false, complete: false, message: '' };
	} else {
		viewResult = { valid: isValid, error: !isValid, complete: isValid, message: messageComputed?.empty || '' };
	}

	return viewResult;
}

export function getValidateComplete(
	message: string,
	value: string,
	checked: boolean,
	empty: boolean,
	required: boolean,
): ResultValidate {
	let viewResult: ResultValidate;
	const isValueEmpty = !value.trim().length;

	if (!required) {
		viewResult = { valid: true, error: false, complete: false, message: '' };
		return viewResult;
	}

	const messageComputed = messages[message];
	if (!messageComputed) console.warn(`Rule "${message}" not found in validation messages.`);

	const isValid = checked;

	if (isValueEmpty) {
		if (empty) {
			viewResult = { valid: isValid, error: false, complete: false, message: '' };
		} else {
			viewResult = { valid: isValid, error: !isValid, complete: isValid, message: messageComputed?.empty || '' };
		}
	} else {
		viewResult = { valid: isValid, error: !isValid, complete: isValid, message: messageComputed?.error || '' };
	}
	return viewResult;
}

export function getValidateCode(
	message: string,
	value: string,
	empty: boolean,
	required: boolean,
	length: number,
): ResultValidate {
	let viewResult: ResultValidate;
	const isValueEmpty = !value.trim().length;

	if (!required) {
		viewResult = { valid: true, error: false, complete: false, message: '' };
		return viewResult;
	}

	const messageComputed = messages[message];
	if (!messageComputed) console.warn(`Rule "${message}" not found in validation messages.`);

	const isComplete = value.length === length;
	const isNumeric = /^\d+$/.test(value);
	const isValid = isComplete && isNumeric;

	if (isValueEmpty && empty) {
		viewResult = { valid: false, error: false, complete: false, message: '' };
	} else if (!isComplete && required) {
		viewResult = { valid: false, error: true, complete: false, message: messageComputed?.empty || '' };
	} else if (!isNumeric && value.length > 0) {
		viewResult = { valid: false, error: true, complete: false, message: messageComputed?.error || '' };
	} else {
		viewResult = {
			valid: isValid,
			error: !isValid,
			complete: isValid,
			message: isValid ? '' : messageComputed?.error || '',
		};
	}

	return viewResult;
}

export function getValidateBox(checked: boolean, empty: boolean, required: boolean): ResultValidate {
	let viewResult: ResultValidate;

	if (!required) {
		viewResult = { valid: true, error: false, complete: false };
		return viewResult;
	}

	let isValid = checked;

	if (empty) {
		viewResult = { valid: isValid, error: false, complete: false };
	} else {
		viewResult = { valid: isValid, error: !isValid, complete: isValid };
	}

	return viewResult;
}

export function getValidateFiles(
	message: string,
	files: File[],
	empty: boolean,
	required: boolean,
	accept: string,
	size: number,
) {
	const isValueEmpty = files.length === 0;
	let viewResult: ResultValidate;

	if (!required && isValueEmpty) {
		viewResult = { valid: true, error: false, complete: false, message: '' };
		return viewResult;
	}

	const messageComputed = messages[message];
	if (!messageComputed) console.warn(`Rule "${message}" not found in validation messages.`);

	if (isValueEmpty) {
		if (empty) {
			viewResult = { valid: false, error: false, complete: false, message: '' };
		} else {
			viewResult = { valid: false, error: true, complete: false, message: messageComputed?.empty || '' };
		}
	} else {
		let message = '';
		const filesValid = files.every((file) => {
			const ext = file.name.toLowerCase().split('.').pop();
			const isAccept = ext ? accept.toLowerCase().includes(ext) : false;

			if (!isAccept) {
				message = messageComputed?.accept || '';
				return false;
			}
			if (file.size > size) {
				message = messageComputed?.size || '';
				return false;
			}
			return true;
		});
		viewResult = filesValid
			? { valid: true, error: false, complete: true, message: '' }
			: { valid: false, error: true, complete: false, message: message };
	}
	return viewResult;
}

export function getUpdateFiles(upload: FileList, currentFiles: File[], maxLength: number, isMultiple: boolean): File[] {
	if (isMultiple) {
		const list = [...currentFiles, ...Array.from(upload)];
		return list.slice(0, maxLength);
	} else {
		return [upload[0]];
	}
}

export async function getViewFiles(fileList: File[]): Promise<ViewFileOptions[]> {
	const setItem = (file: File): Promise<ViewFileOptions> => {
		return new Promise((resolve) => {
			const isImage = file.type.startsWith('image/');
			const reader = new FileReader();

			reader.onload = (event) => {
				resolve({
					id: `file-${Math.random().toString(36).substring(2, 11)}`,
					name: file.name,
					src: event.target?.result || '',
					ext: file.name.toLowerCase().split('.').pop() || '',
					img: file.type.toLowerCase().includes('image'),
				});
			};
			reader.onerror = (event) => {
				console.warn(event);
				resolve({
					id: `file-${Math.random().toString(36).substring(2, 11)}`,
					name: file.name,
					src: '',
					ext: '',
					img: isImage,
				});
			};

			if (isImage) {
				reader.readAsDataURL(file);
			} else {
				resolve({
					id: `file-${Math.random().toString(36).substring(2, 11)}`,
					name: file.name,
					src: '',
					ext: file.name.toLowerCase().split('.').pop() || '',
					img: false,
				});
			}
		});
	};

	return Promise.all(fileList.map((file) => setItem(file)));
}
