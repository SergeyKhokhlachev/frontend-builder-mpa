import Form from '@/components/shared/form/form';

import { CALLBACK } from '@/api/request/index';

export default class Callback {
	readonly $element: HTMLFormElement;
	readonly $button: HTMLButtonElement | null;

	protected formInstance: Form | null = null;

	constructor($selector: HTMLFormElement) {
		this.$element = $selector;
		this.$button = this.$element.querySelector('.js-callback__button');

		this.formInstance = new Form(this.$element);

		if (!this.$element) return;

		this.init();
	}

	public init() {
		this.$element.addEventListener('submit', this.submitHandler);
	}

	public destroy() {
		this.$element.removeEventListener('submit', this.submitHandler);
		this.formInstance?.destroy();
	}

	public reinit() {
		this.destroy();
		this.init();
	}

	public submit() {
		if (!this.formInstance?.checkForm(true) || !this.$element) return;

		this.$button?.classList.add('loading');
		const formData = new FormData(this.$element);

		CALLBACK(formData)
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

	private submitHandler = (event: SubmitEvent) => {
		event.preventDefault();
		this.submit();
	};
}
