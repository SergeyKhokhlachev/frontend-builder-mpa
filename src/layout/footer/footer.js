import { classInstance } from '@/common/helpers';
import { breakpoint } from '@/common/breakpoint';

export default class Footer {
	constructor(selector) {
		this.$container = selector;

		this.$collapse = null;
		this.$collapseElemets = [];

		this.mediaQuery = null;

		if (!this.$container) return;

		this.init();
	}

	init() {
		classInstance.set(this.$container, { footer: this });

		this.$collapse = this.$container.querySelector('.js-collapse');
		this.$collapseElemets = Array.from(this.$collapse.querySelectorAll('.js-collapse__element'));

		this.mediaQuery = window.matchMedia(`(width >= ${breakpoint.tablet}px)`);
		this.mediaQuery.addEventListener('change', this.mediaHandler);
		if (this.mediaQuery.matches) this.updateMenu(true);
	}

	destroy() {
		classInstance.del(this.$container, 'footer');

		this.mediaQuery?.removeEventListener('change', this.mediaHandler);
		this.mediaQuery = null;
		this.$collapse = null;
		this.$collapseElemets = [];
	}

	reinit() {
		this.destroy();
		this.init();
	}

	updateMenu(key) {
		const collapseInstance = classInstance.get(this.$collapse);
		this.$collapseElemets.forEach((element) => {
			if (key) {
				collapseInstance.collapse.open(element);
			} else {
				collapseInstance.collapse.close(element);
			}
		});
	}

	mediaHandler = (event) => {
		if (event.matches) {
			this.updateMenu(true);
		} else {
			this.updateMenu(false);
		}
	};
}
