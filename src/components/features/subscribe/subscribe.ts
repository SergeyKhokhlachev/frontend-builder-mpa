import Form from '@/components/shared/form/form';
import type { FormChangeEvent } from '@/components/shared/form/form.types';

import { SUBSCRIBE } from '@/api/request/index';

export default class Subscribe {
	readonly $element: HTMLElement;
	readonly $form: HTMLFormElement | null;
	readonly $button: HTMLButtonElement | null;

	protected formInstance: Form | null = null;

	constructor($selector: HTMLElement) {
		this.$element = $selector;
		this.$form = this.$element.querySelector('.js-subscribe__form');
		this.$button = this.$element.querySelector('.js-subscribe__button');

		if (this.$form) this.formInstance = new Form(this.$form);
		if (!this.$element) return;

		this.init();
	}

	public init() {
		this.$form?.addEventListener('formChange', this.changeHandler);
		this.$form?.addEventListener('submit', this.submitHandler);
	}

	public destroy() {
		this.$form?.removeEventListener('formChange', this.changeHandler);
		this.$form?.removeEventListener('submit', this.submitHandler);
		this.formInstance?.destroy();
	}

	public reinit() {
		this.destroy();
		this.init();
	}

	public submit() {
		if (!this.formInstance?.checkForm(true) || !this.$form) return;

		this.$button?.classList.add('loading');
		const formData = new FormData(this.$form);

		SUBSCRIBE(formData)
			.then((response) => {
				this.$button?.classList.remove('loading');
				window.app.notify?.append({
					type: response.status,
					delay: 10000,
					title: response.title,
					text: response.text,
				});
			})
			.catch((error) => {
				window.app.notify?.append({
					type: 'error',
					delay: 10000,
					title: 'Ошибка',
					text: error instanceof Error ? error.message : String(error),
				});
			});
	}

	private changeHandler = (event: FormChangeEvent) => {
		if (this.$button) this.$button.disabled = !event.detail.valid;
	};

	private submitHandler = (event: SubmitEvent) => {
		event.preventDefault();
		this.submit();
	};
}
