import Tabs from '@/components/shared/tabs/tabs';

export type TabsMode = 'mouseenter' | 'click';

export interface TabsOptions {
	mode?: TabsMode;
	selectorButton?: string;
	selectorElement?: string;
}

export interface TabsShownDetail {
	tabs: Tabs;
}

export type TabsShownEvent = CustomEvent<TabsShownDetail>;

declare global {
	interface HTMLElementEventMap {
		tabsShown: TabsShownEvent;
	}
}
