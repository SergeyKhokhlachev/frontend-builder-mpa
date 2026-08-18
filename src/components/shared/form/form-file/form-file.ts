import { classInstance } from '@/common/helpers';
import FormElement from '@/components/shared/form/form-element/form-element';
import { getValidateFiles, getUpdateFiles, getViewFiles } from '@/components/shared/form/composition/helpers';
import { dispatchElementValidate, dispatchElementChange } from '@/components/shared/form/composition/events';
import type { ResultValidate, ViewFileOptions } from '@/components/shared/form/form.types';
/**
 *  UI Компонент FormFile
 * @category 3 Form
 * @example
 * new FormFile(document.querySelector('input[type="file"]'));
 *
 * @param {HTMLElement} $selector - HTMLInputElement формы
 */

export default class FormFile extends FormElement {
	readonly $element: HTMLInputElement;
	readonly $wrapper: HTMLElement | null;
	readonly $fileVue: HTMLElement | null = null;
	readonly message: string = 'file';
	readonly accept: string;
	readonly length: number;
	readonly size: number;

	public files: File[] = [];
	protected active: boolean = false;
	protected viewFiles: ViewFileOptions[] = [];
	protected result: ResultValidate = { valid: false, error: false, complete: false, message: '' };

	constructor($selector: HTMLInputElement) {
		super($selector);

		this.$element = $selector;
		this.$wrapper = this.$element.parentElement;
		if (this.$wrapper) this.$fileVue = this.$wrapper.querySelector('.js-form-file__vue');

		this.accept = this.$element.accept || '.png,.jpg,.jpeg,.gif,.bmp,.txt';
		this.length = Number(this.$element.dataset.lenght) || 5;
		this.size = Number(this.$element.dataset.size) || 5242880;

		this.init();
	}

	/**
	 *  Инициализировать компонент
	 */
	public init() {
		classInstance.set(this.$element, { formElement: this });
		this.$element.addEventListener('input', this.changeHandler);
		if (this.$wrapper) {
			this.$wrapper.addEventListener('click', this.removeHandler);
			this.$wrapper.addEventListener('drop', this.dropHandler);
			this.$wrapper.addEventListener('dragover', this.preventHandler);
			this.$wrapper.addEventListener('dragenter', this.preventHandler);
		}

		this.accessibility();
		this.validate(false, true);
	}

	/**
	 *  Удалить обрабочики событий и сбросить состояние
	 */
	public destroy() {
		classInstance.del(this.$element, 'formElement');
		this.$element.removeEventListener('input', this.changeHandler);
		if (this.$wrapper) {
			this.$wrapper.removeEventListener('click', this.removeHandler);
			this.$wrapper.removeEventListener('drop', this.dropHandler);
			this.$wrapper.removeEventListener('dragover', this.preventHandler);
			this.$wrapper.removeEventListener('dragenter', this.preventHandler);
		}
		this.active = false;
		this.files = [];
		this.viewFiles = [];
		this.result = { valid: false, error: false, complete: false, message: '' };
	}

	/**
	 *  Переопределить обрабочики событий
	 * @example
	 * const myElement = app.classInstance.get(document.querySelector('input[type="file"]'));
	 * myElement.formElement.reinit();
	 */
	public reinit() {
		this.destroy();
		this.init();
	}

	/**
	 *  Метод валидации элемента
	 * @param {Boolean} [draw=true] - если указать false - представление не будет обновляться при валидации.
	 * @param {Boolean} [empty=false] - если указать true - пустое поле не будет выводить ошибку, но останеться не валидным.
	 * @returns {Boolean} результат валидации
	 * @example
	 * const myElement = app.classInstance.get(document.querySelector('input[type="file"]'));
	 * myElement.formElement.validate();
	 */
	public validate(draw: boolean = true, empty: boolean = false): boolean {
		this.result = getValidateFiles(this.message, this.files, empty, this.$element.required, this.accept, this.size);

		if (draw) this.render(this.result);
		this.$element.setAttribute('aria-invalid', `${!this.result.valid}`);

		dispatchElementValidate(this.$element, this.result.valid);
		return this.result.valid;
	}

	public accessibility() {
		const elementId = this.$element.id || `form-el-${Math.random().toString(36).substring(2, 11)}`;

		if (!this.$element.id) this.$element.id = elementId;

		const errorId = `${elementId}-error`;

		this.$element.setAttribute('aria-required', `${this.$element.required}`);
		this.$element.setAttribute('aria-describedby', errorId);
		super.accessibility(elementId, errorId);
	}

	private appenFiles = (upload: FileList) => {
		const updated = getUpdateFiles(upload, this.files, this.length, this.$element.multiple);

		getViewFiles(updated).then((result) => {
			this.viewFiles = result;
			this.files = updated;
			this.active = !!updated.length;
			this.renderFiles();
			this.validate(true, false);
			dispatchElementChange(this.$element, this.files);
		});
	};

	private removeFile = (name: string) => {
		this.files = this.files.filter((file) => file.name !== name);
		this.viewFiles = this.viewFiles.filter((item) => item.name !== name);
		this.active = !!this.files.length;
		this.renderFiles();
		this.validate(true, true);
		dispatchElementChange(this.$element, this.files);
	};

	private renderFiles() {
		const fragment = document.createDocumentFragment();

		this.viewFiles.forEach((item) => {
			const $item = document.createElement('div');
			$item.className = 'form-file__item';

			if (item.img) {
				$item.setAttribute('role', 'listitem');
			}

			const $button = document.createElement('button');
			$button.className = 'form-file__remove';
			$button.type = 'button';
			$button.setAttribute('aria-label', `Удалить файл ${item.name}`);
			$button.setAttribute('data-target', `${item.name}`);

			const $buttonIcon = document.createElement('i');
			$buttonIcon.className = 'icon icon-close';
			$buttonIcon.setAttribute('aria-hidden', 'true');

			$button.appendChild($buttonIcon);
			$item.appendChild($button);

			if (item.img && typeof item.src === 'string') {
				const $img = document.createElement('img');
				$img.src = item.src;
				$img.alt = item.name;
				$item.appendChild($img);
			} else {
				const $extWrapper = document.createElement('div');
				$extWrapper.className = 'form-file__ext';

				const $fileIcon = document.createElement('i');
				$fileIcon.className = 'icon icon-file';
				$fileIcon.title = `Файл ${item.name}`;
				$fileIcon.setAttribute('aria-label', `Файл ${item.name}`);

				const $span = document.createElement('span');
				$span.textContent = `.${item.ext}`;

				$extWrapper.appendChild($fileIcon);
				$extWrapper.appendChild($span);
				$item.appendChild($extWrapper);
			}

			fragment.appendChild($item);
		});

		if (this.$fileVue) {
			this.$fileVue.textContent = '';
			this.$fileVue.appendChild(fragment);
		}

		this.$wrapper?.classList.toggle('active', !!this.viewFiles.length);
	}

	private changeHandler = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.files?.length) this.appenFiles(target.files);
	};

	private dropHandler = (event: DragEvent) => {
		if (this.$element.disabled) return;
		const dt = event.dataTransfer;
		if (dt?.files.length) this.appenFiles(dt.files);
	};

	private removeHandler = (event: Event) => {
		const $target = event.target as HTMLElement;
		const $button = $target?.closest('.form-file__remove') as HTMLElement;
		if ($button) {
			const target = $button.dataset.target;
			if (target) this.removeFile(target);
		}
	};

	private preventHandler = (event: Event) => {
		event.preventDefault();
	};
}
