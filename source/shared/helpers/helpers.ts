/**
 * @desc WeakMap коллекция экземпляров классов UI компонентов. Позволяет получить экземпляр класса по ссылке на целевой DOM элемент
 * @category 1 Helpers
 * @example
 * // file one.js
 * new Tabs(document.querySelector('.js-tabs'));
 * @example
 * // file other.js
 * const myTab = app.classInstance.get(document.querySelector('.js-tabs'));
 * myTab.tabs.open('tab-1');
 */
const classInstance = {
	data: new WeakMap(),
	get(key: object): any {
		return this.data.get(key);
	},
	set(key: object, element: object): void {
		if (this.data.has(key)) {
			Object.assign(this.data.get(key), element);
		} else {
			this.data.set(key, element);
		}
	},
	del(key: object, prop: string): void {
		const element = this.data.get(key);
		if (element) {
			delete element[prop];
			if (Object.keys(element).length === 0) this.data.delete(key);
		}
	},
};

/**
 * @desc Функция отределения типа устройства пользователя
 * @category 1 Helpers
 * @returns {string} mobile | desktop
 * @example
 * app.getDeviceType();
 */
function getDeviceType(): string {
	const userAgent = navigator.userAgent.toLowerCase();
	const isMobile = /mobile|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(
		userAgent,
	);

	if (isMobile) {
		return 'mobile';
	} else {
		return 'desktop';
	}
}

/**
 * @desc Функция блокировки скролла документа
 * @category 1 Helpers
 * @example
 * app.disableScroll();
 */
function disableScroll(): void {
	const pagePosition = window.scrollY;
	document.body.classList.add('disable-scroll');
	document.body.dataset.position = String(pagePosition);
	document.body.style.top = `${-pagePosition}px`;
}

/**
 * @desc Функция разблокировки скролла документа
 * @category 1 Helpers
 * @example
 * app.enableScroll();
 */
function enableScroll(): void {
	const pagePosition = parseInt(document.body.dataset.position, 10);
	document.body.style.top = 'auto';
	document.body.classList.remove('disable-scroll');
	window.scroll({ top: pagePosition, left: 0 });
	document.body.removeAttribute('data-position');
}

/**
 * @desc Функция проверки клика вне элемента
 * @category 1 Helpers
 * @param {MouseEvent} [event] - обьект события
 * @param {HTMLElement} [element] - целевой элемент
 * @returns {boolean}
 * @example
 * app.clickOutside();
 */
function clickOutside(event: MouseEvent, element: HTMLElement): boolean {
	const $target: HTMLElement = event.target as HTMLElement;
	return !element.contains($target);
}

export { classInstance, getDeviceType, disableScroll, enableScroll, clickOutside };
