export interface LocationChangeDetail {
	location: string;
}

export type LocationChangeEvent = CustomEvent<LocationChangeDetail>;

declare global {
	interface HTMLElementEventMap {
		locationChange: LocationChangeEvent;
	}
}
