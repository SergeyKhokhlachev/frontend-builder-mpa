import Collapse from '@/components/shared/collapse/collapse';

export type CollapseMode = 'collapse' | 'accordion';

export interface CollapseOptions {
	mode?: CollapseMode;
	selectorElement?: string;
	selectorButton?: string;
}

export interface CollapseOpenDetail {
	collapse: Collapse;
}

export interface CollapseCloseDetail {
	collapse: Collapse;
}

export type CollapseOpenEvent = CustomEvent<CollapseOpenDetail>;
export type CollapseCloseEvent = CustomEvent<CollapseCloseDetail>;

declare global {
	interface HTMLElementEventMap {
		collapseOpen: CollapseOpenEvent;
		collapseClose: CollapseCloseEvent;
	}
}
