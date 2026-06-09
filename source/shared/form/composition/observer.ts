import { classInstance } from '@/shared/helpers/helpers';

/**
 * @desc FormObserver
 * @category 3 Form
 * @constructor
 * @param {HTMLFormElement} selector - HTMLFormElement формы
 */
export class FormObserver {
	readonly $form: HTMLFormElement;
	private looked: boolean;

	protected $elementsRequired: Array<HTMLFormElement>;

	constructor(selector: HTMLFormElement) {
		this.$form = selector;
		this.looked = false;

		if (!this.$form) return;

		this.init();
	}

	/**
	 * @desc Инициализировать Наблюдатель
	 */
	public init(): void {
		this.$elementsRequired = Array.from(this.$form.querySelectorAll('[required]'));

		this.changeHandler = this.changeHandler.bind(this);
		this.$elementsRequired.forEach(($element) => {
			if ($element.dataset.look) this.looked = true;
			$element.addEventListener('elementChange', this.changeHandler);
		});
	}

	/**
	 * @desc Удалить обрабочики событий
	 */
	public destroy(): void {
		this.$elementsRequired.forEach(($element) =>
			$element.removeEventListener('elementChange', this.changeHandler),
		);
	}

	/**
	 * @desc Переопределить обрабочики событий
	 */
	public reinit(): void {
		this.destroy();
		this.init();
	}

	private changeHandler(event: MouseEvent): void {
		const target: HTMLFormElement = event.target as HTMLFormElement;

		if (target.dataset.look) this.checkLooked();
		const element = classInstance.get(target);
		element?.formElement.validate({ noEmpty: true });
		this.formChange();
	}

	private checkLooked(): void {
		this.looked = false;
		const $elementsLook = this.$elementsRequired.filter(
			($element: HTMLFormElement) => $element.dataset.look === 'true',
		);
		$elementsLook.forEach(($element) => {
			const element = classInstance.get($element);
			if (!element?.formElement.validate({ noRender: true })) {
				this.looked = true;
				return;
			}
		});
	}

	private formChange(): void {
		/**
		 * @desc Событие изменения значения обязательных полей формы.
		 * @category 3 Form
		 * @event Form#formChange
		 * @property {Object} detail.looked - статус формы
		 * @example
		 * document.querySelector('.js-form').addEventListener('formChange', (event) => {
		 * 	console.log(event.detail.looked);
		 * });
		 */
		this.$form.dispatchEvent(
			new CustomEvent('formChange', {
				detail: {
					looked: this.looked,
				},
			}),
		);
	}
}
