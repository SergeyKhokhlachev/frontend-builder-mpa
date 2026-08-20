import type { LocationChangeDetail } from '@/components/features/location/location.types';

export default class Location {
	readonly $element: HTMLElement;
	readonly $value: HTMLElement | null = null;

	constructor($selector: HTMLElement) {
		this.$element = $selector;

		if (!this.$element) return;

		this.$value = this.$element.querySelector('.js-location-value');

		this.init();
	}

	public init() {
		document.addEventListener('locationChange', this.changeHandler);
	}

	public destroy() {
		document.removeEventListener('locationChange', this.changeHandler);
	}

	public reinit() {
		this.destroy();
		this.init();
	}

	private changeHandler = (event: Event) => {
		const customEvent = event as CustomEvent<LocationChangeDetail>;
		if (this.$value) this.$value.textContent = customEvent.detail.location;
	};
}
