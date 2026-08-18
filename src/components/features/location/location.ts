import { getCityByCoords } from '@/common/helpers';
import type { LocationChangeDetail } from '@/components/features/location/location.types';

export default class Location {
	readonly apiKey: string = import.meta.env.VITE_YMAP_API_KEY;
	readonly modalID: string = '#modal-location';
	readonly $element: HTMLElement;

	readonly $value: HTMLElement | null = null;
	readonly $define: HTMLElement | null = null;
	readonly $dropdown: HTMLElement | null = null;
	readonly $approve: HTMLElement | null = null;
	readonly $modal: HTMLElement | null = null;

	protected location: string | null = null;

	constructor($selector: HTMLElement) {
		this.$element = $selector;

		if (!this.$element) return;

		this.$value = this.$element.querySelector('.js-location-value');
		this.$define = this.$element.querySelector('.js-location-define');
		this.$dropdown = this.$element.querySelector('.js-location-dropdown');
		this.$approve = this.$element.querySelector('.js-location-approve');
		this.$modal = this.$element.querySelector('.js-location-modal');

		this.init();
	}

	public init() {
		if (this.$dropdown) {
			this.setLocation();
			this.$approve?.addEventListener('click', this.approveHandler);
			this.$modal?.addEventListener('click', this.modalHandler);
		}
		document.addEventListener('locationChange', this.changeHandler);
	}

	public destroy() {
		this.$approve?.removeEventListener('click', this.approveHandler);
		this.$modal?.removeEventListener('click', this.modalHandler);
		document.removeEventListener('locationChange', this.changeHandler);
	}

	public reinit() {
		this.destroy();
		this.init();
	}

	private approve() {
		this.$element.classList.remove('active');
		if (!this.location) return;
		this.dispatchChange(this.location);
	}

	private modal() {
		this.$element.classList.remove('active');
		window.app.modal?.open('#modal-location');
	}

	private setLocation() {
		getCityByCoords(this.apiKey)
			.then((result) => {
				this.location = result;
				if (this.$define && this.location) {
					this.$define.textContent = this.location;
					this.$element.classList.add('active');
				}
			})
			.catch((errors) => {
				console.warn(errors);
			});
	}

	private approveHandler = () => {
		this.approve();
	};

	private modalHandler = () => {
		this.modal();
	};

	private changeHandler = (event: Event) => {
		const customEvent = event as CustomEvent<LocationChangeDetail>;
		if (this.$value) this.$value.textContent = customEvent.detail.location;
	};

	private dispatchChange(location: string) {
		document.dispatchEvent(
			new CustomEvent<LocationChangeDetail>('locationChange', {
				bubbles: true,
				cancelable: true,
				detail: {
					location: location,
				},
			}),
		);
	}
}
