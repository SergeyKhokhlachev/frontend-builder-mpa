import { enableScroll, disableScroll } from '@/common/helpers';

export default class ProductFilter {
	readonly $element: HTMLFormElement;
	readonly $close: HTMLButtonElement | null;
	readonly $open: HTMLButtonElement | null;

	constructor($selector: HTMLFormElement) {
		this.$element = $selector;

		this.$close = this.$element.querySelector('.js-filter-close');
		this.$open = document.querySelector('.js-filter-open');

		if (!this.$element) return;

		this.init();
	}

	public init() {
		this.$open?.addEventListener('click', this.openHandler);
		this.$close?.addEventListener('click', this.closeHandler);
	}

	public destroy() {
		this.$open?.removeEventListener('click', this.openHandler);
		this.$close?.removeEventListener('click', this.closeHandler);
	}

	public reinit() {
		this.destroy();
		this.init();
	}

	public toggle(key: boolean) {
		this.$element.classList.toggle('active', key);
	}

	private openHandler = () => {
		this.toggle(true);
		disableScroll();
	};

	private closeHandler = () => {
		this.toggle(false);
		enableScroll();
	};
}
