import { classInstance, enableScroll, disableScroll } from '@/common/helpers';

export default class Header {
	constructor(selector, options = {}) {
		this.$container = selector;

		this.selectorToggle = options.selectorToggle || '.js-header-toggle';
		this.selectorClose = options.selectorClose || '.js-header-close';

		this.$toggleButtons = [];
		this.$closeButtons = [];
		this.scrolled = false;
		this.scrollY = 300;

		if (!this.$container) return;

		this.init();
	}

	init() {
		classInstance.set(this.$container, { header: this });

		this.$toggleButtons = Array.from(this.$container.querySelectorAll(this.selectorToggle));
		this.$closeButtons = Array.from(this.$container.querySelectorAll(this.selectorClose));

		this.scrolled = window.scrollY > this.scrollY;
		if (this.scrolled) document.body.classList.add('header-scrolled');
		this.$toggleButtons.forEach(($button) => $button.addEventListener('click', this.toggleHandler));
		this.$closeButtons.forEach(($button) => $button.addEventListener('click', this.closeHandler));
		window.addEventListener('scroll', this.scrollHandler);
		window.addEventListener('keydown', this.escHandler);
	}

	destroy() {
		classInstance.del(this.$container, 'header');
		this.$toggleButtons.forEach(($button) => $button.removeEventListener('click', this.toggleHandler));
		this.$closeButtons.forEach(($button) => $button.removeEventListener('click', this.closeHandler));
		window.removeEventListener('scroll', this.scrollHandler);
		window.removeEventListener('keydown', this.escHandler);

		this.$toggleButtons = [];
		this.$closeButtons = [];
	}

	reinit() {
		this.destroy();
		this.init();
	}

	openMenu() {
		document.body.classList.add('menu-open');
		this.$toggleButtons.forEach(($button) => {
			$button.setAttribute('aria-expanded', 'true');
		});
		disableScroll();
	}

	closeMenu() {
		document.body.classList.remove('menu-open');
		this.$toggleButtons.forEach(($button) => {
			$button.setAttribute('aria-expanded', 'false');
		});
		enableScroll();
	}

	toggleScrolled(key) {
		document.body.classList.toggle('header-scrolled', key);
		this.scrolled = key;
	}

	toggleHandler = () => {
		if (document.body.classList.contains('menu-open')) {
			this.closeMenu();
		} else {
			this.openMenu();
		}
	};

	closeHandler = () => {
		this.closeMenu();
	};

	scrollHandler = () => {
		if (document.body.classList.contains('disable-scroll')) return;
		if (window.scrollY >= this.scrollY && !this.scrolled) {
			this.toggleScrolled(true);
		} else if (window.scrollY < this.scrollY && this.scrolled) {
			this.toggleScrolled(false);
		}
	};

	escHandler = (event) => {
		if (event.key === 'Escape' && document.body.classList.contains('menu-open')) {
			this.closeMenu();
		}
	};
}
