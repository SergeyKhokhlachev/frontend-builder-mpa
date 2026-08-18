import Dropdown from '@/components/shared/dropdown/dropdown';

export type DropdownMode = 'mouseenter' | 'click';

export interface DropdownOptions {
	mode?: DropdownMode;
	selectorButton?: string;
}

export interface DropdownOpenDetail {
	dropdown: Dropdown;
}

export interface DropdownCloseDetail {
	dropdown: Dropdown;
}

export type DropdownOpenEvent = CustomEvent<DropdownOpenDetail>;
export type DropdownCloseEvent = CustomEvent<DropdownCloseDetail>;

declare global {
	interface HTMLElementEventMap {
		dropdownOpen: DropdownOpenEvent;
		dropdownClose: DropdownCloseEvent;
	}
}
