import { classInstance } from '@/shared/helpers/helpers';

import { FormElement } from '../form-element';

import { useElementChange, useElementComplete } from '../composition/elementEvents';
import { useGetValid } from './composition/getValid';
import { useGetValue } from './composition/getValue';
import { useGetReader } from './composition/getReader';

/**
 * @desc UI Компонент FormFile
 * @category 3 Form
 * @example
 * new FormFile(document.querySelector('input[data-type="form-file"]'));
 * @constructor
 * @param {HTMLElement} selector - HTMLInputElement формы
 * @param {Object} [options] - опции конфигурации
 * @param {String} [options.message="file"] - имя правила для вывода сообщений об ошибке, если не указанно - береться значение attr data-message
 * @param {Number} [options.size=5242880] - размер файла
 * @param {Number} [options.length=5] - max количество файлов
 * @param {String} [options.accept=".png,.jpg,.jpeg,.gif,.bmp"] - разрешенный формат файла
 * @param {String} [options.selectorFileContainer=".js-form-file"] - селектор контейнера поля
 * @param {String} [options.selectorFileVue=".js-form-file__vue"] - селектор вывода превью файла
 */

export class FormFile extends FormElement {
	readonly $element: HTMLInputElement;
	readonly selectorFileContainer: string;
	readonly selectorFileVue: string;

	protected message: string;
	protected value: Array<File>;
	protected reader: Array<ReaderEll>;
	readonly size: number;
	readonly length: number;
	readonly accept: string;
	readonly multiple: boolean;

	protected $fileContainer: HTMLElement | null;
	protected $fileVue: HTMLElement | null;

	constructor(
		selector: HTMLInputElement,
		options: {
			message?: string;
			size?: number;
			length?: number;
			accept?: string;
			selectorContainer?: string;
			selectorMessage?: string;
			selectorFileContainer?: string;
			selectorFileVue?: string;
		} = {},
	) {
		super(selector, options);

		this.value = [];
		this.message = options.message || this.$element.dataset.message || 'file';
		this.size = options.size || Number(this.$element.dataset.size) || 5242880;
		this.length = options.length || Number(this.$element.dataset.length) || 5;
		this.accept = options.accept || this.$element.accept || '.png,.jpg,.jpeg,.gif,.bmp';
		this.multiple = this.$element.multiple;

		this.selectorFileContainer = options.selectorFileContainer || '.js-form-file';
		this.selectorFileVue = options.selectorFileVue || '.js-form-file__vue';

		this.init();
	}

	/**
	 * @desc Инициализировать компонент
	 */
	public init(): void {
		classInstance.set(this.$element, { formElement: this });

		super.init();

		this.$fileContainer = this.$container.querySelector(this.selectorFileContainer);
		this.$fileVue = this.$container.querySelector(this.selectorFileVue);

		this.changeHandler = this.changeHandler.bind(this);
		this.$element.addEventListener('change', this.changeHandler);

		this.dragoverHandler = this.dragoverHandler.bind(this);
		this.$fileContainer.addEventListener('dragover', this.dragoverHandler, false);

		this.dropHandler = this.dropHandler.bind(this);
		this.$fileContainer.addEventListener('drop', this.dropHandler, false);

		this.removeHandler = this.removeHandler.bind(this);
		this.$fileVue.addEventListener('click', this.removeHandler, false);
	}

	/**
	 * @desc Удалить обрабочики событий
	 */
	public destroy(): void {
		classInstance.del(this.$element, 'formElement');

		this.$element.removeEventListener('change', this.changeHandler);
		this.$fileContainer.removeEventListener('dragover', this.dragoverHandler);
		this.$fileContainer.removeEventListener('drop', this.dropHandler);
		this.$fileVue.removeEventListener('click', this.removeHandler, false);
	}

	/**
	 * @desc Переопределить обрабочики событий
	 * @example
	 * const myElement= app.classInstance.get(document.querySelector('input[data-type="form-file"]'));
	 * myElement.formElement.reinit();
	 */
	public reinit(): void {
		this.destroy();
		this.init();
	}

	/**
	 * @desc Метод валидации элемента
	 * @param {Object} [options] - опции конфигурации
	 * @param {Boolean} [options.noRender=false] - если указать true - представление не будет обновляться при валидации.
	 * @param {Boolean} [options.noEmpty=false] - если указать true - пустое поле не будет валидироваться
	 * @param {String} [options.message] - имя правила для вывода сообщений об ошибке
	 * @returns {Boolean} результат валидации
	 * @example
	 * const myElement = app.classInstance.get(document.querySelector('input[data-type="form-file"]'));
	 * myElement.formElement.validate();
	 */
	public validate(options: OptionsVE = {}): boolean {
		const optionsValidate: OptionsVE = {
			noRender: options.noRender || false,
			noEmpty: options.noEmpty || false,
			message: options.message || this.message,
			size: this.size,
			accept: this.accept,
		};

		const result: ResultVE = useGetValid(this.value, optionsValidate);

		if (result.message) this.messageComputed = result.message;
		if (result.valid && !result.error) useElementComplete(this.$element, { files: this.value });
		if (!optionsValidate.noRender) {
			this.valid = result.valid;
			this.error = result.error;
			this.render();
		}

		return result.valid;
	}

	private dragoverHandler(event: DragEvent): void {
		event.preventDefault();
	}

	private dropHandler(event: DragEvent): void {
		event.preventDefault();
		const dt = event.dataTransfer;
		const { files } = dt;
		if (files[0]) this.updateFile(files);
	}

	private changeHandler(event: InputEvent): void {
		const $target: HTMLInputElement = event.target as HTMLInputElement;
		if ($target.files[0]) this.updateFile($target.files);
	}

	private removeHandler(event: MouseEvent): void {
		const $target: HTMLElement = event.target as HTMLElement;
		const $button: HTMLElement = $target.closest('.form-file__remove');
		if ($button) {
			const target = $button.dataset.target;
			this.value = this.value.filter((file: File) => file.name !== target);
			this.reader = this.reader.filter((item: ReaderEll) => item.name !== target);
			this.$element.value = '';
			this.renderResult(this.reader);
			useElementChange(this.$element, { files: this.value });
		}
	}

	private updateFile(files: FileList): void {
		const value = useGetValue(files, this.value, this.length, this.multiple);
		if (value) {
			useGetReader(value).then((result: Array<ReaderEll>) => {
				this.reader = result;
				this.value = value;
				this.renderResult(result);
				useElementChange(this.$element, { files: this.value });
			});
		} else {
			this.value = value;
		}
	}

	private renderResult(result: Array<ReaderEll>): void {
		let fragment = '';
		result.forEach((item) => {
			if (item.img) {
				fragment += `
					<div class="form-file__item">
						<button class="form-file__remove" type="button" data-target="${item.name}">
							<i class="icon icon-close"></i>
						</button>
						<img src="${item.src}" alt="${item.name}">
					</div>
				`;
			} else {
				fragment += `
					<div class="form-file__item">
						<button class="form-file__remove" type="button" data-target="${item.name}">
							<i class="icon icon-close"></i>
						</button>
						<div class="form-file__ext">
							<i class="icon icon-file"></i>
							<span>.${item.ext}</span>
						</div>
					</div>
				`;
			}
		});
		this.$fileVue.innerHTML = fragment;
		this.$fileContainer.classList.toggle('active', !!result.length);
	}
}
