import Form from '@/components/shared/form/form';
import Rating from '@/components/shared/rating/rating';

import { REVIEWS } from '@/api/request/index';

export default class Reviews {
	readonly $element: HTMLFormElement;
	readonly $rating: HTMLElement | null = null;
	readonly $button: HTMLButtonElement | null = null;

	protected formInstance: Form | null = null;
	protected ratingInstance: Rating | null = null;

	constructor($selector: HTMLFormElement) {
		this.$element = $selector;
		this.$rating = this.$element.querySelector('.js-rating');
		this.$button = this.$element.querySelector('.js-reviews__button');

		this.formInstance = new Form(this.$element);
		if (this.$rating) this.ratingInstance = new Rating(this.$rating);

		if (!this.$element) return;

		this.init();
	}

	public init() {
		this.$element.addEventListener('submit', this.submitHandler);
	}

	public destroy() {
		this.$element.removeEventListener('submit', this.submitHandler);
		this.formInstance?.destroy();
		this.ratingInstance?.destroy();
	}

	public reinit() {
		this.destroy();
		this.init();
	}

	public submit() {
		if (!this.formInstance?.checkForm(true) || !this.$element) return;

		this.$button?.classList.add('loading');
		const formData = new FormData(this.$element);

		REVIEWS(formData)
			.then((response) => {
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
			})
			.finally(() => {
				this.$button?.classList.remove('loading');
			});
	}

	private submitHandler = (event: SubmitEvent) => {
		event.preventDefault();
		this.submit();
	};
}
