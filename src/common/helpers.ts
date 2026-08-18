/**
 * WeakMap коллекция экземпляров классов UI компонентов. Позволяет получить экземпляр класса по ссылке на целевой DOM элемент
 * @category 1 Helpers
 * @example
 * // file one.js
 * new Tabs(document.querySelector('.js-tabs'));
 * @example
 * // file other.js
 * const myTab = app.classInstance.get(document.querySelector('.js-tabs'));
 * myTab.tabs.open('tab-1');
 */

type InstanceRegistry = Record<string, unknown>;

const classInstance = {
	data: new WeakMap<object, InstanceRegistry>(),
	get<T = InstanceRegistry>(key: object): T | undefined {
		return this.data.get(key) as T | undefined;
	},
	set(key: object, element: InstanceRegistry) {
		const current = this.data.get(key);

		if (current) {
			Object.assign(current, element);
		} else {
			this.data.set(key, { ...element });
		}
	},
	del(key: object, prop: string) {
		const current = this.data.get(key);

		if (current && prop in current) {
			delete current[prop];

			if (Object.keys(current).length === 0) {
				this.data.delete(key);
			}
		}
	},
};

const priceFormatter = new Intl.NumberFormat('ru-RU', {
	style: 'currency',
	currency: 'RUB',
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
});

interface YandexGeoComponent {
	kind: string;
	name: string;
}

function getCurrentPosition(): Promise<GeolocationPosition> {
	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			return reject(new Error('Geolocation API is not available'));
		}
		navigator.geolocation.getCurrentPosition(resolve, reject);
	});
}

async function getCityByCoords(apiKey: string): Promise<string | null> {
	try {
		const location = await getCurrentPosition();
		const { longitude: lng, latitude: lat } = location.coords;
		const url = `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${apiKey}&geocode=${lng},${lat}&results=1&kind=locality`;

		const res = await fetch(url);

		if (!res.ok) throw new Error(`Ошибка HTTP: ${res.status}`);

		const data = await res.json();
		const features = data.response?.GeoObjectCollection?.featureMember ?? [];

		if (features.length === 0) return null;

		const components: YandexGeoComponent[] = features[0].GeoObject?.metaDataProperty?.GeocoderMetaData?.Address?.Components ?? [];
		const locality = components.find((c) => c.kind === 'locality');

		return locality?.name ?? null;
	} catch (error) {
		console.warn('Ошибка при определении города:', error);
		return null;
	}
}

function disableScroll() {
	const pagePosition = window.scrollY;
	document.body.classList.add('disable-scroll');
	document.body.dataset.position = String(pagePosition);
	document.body.style.top = `${-pagePosition}px`;
}

function enableScroll() {
	const pagePosition = parseInt(document.body.dataset.position || '0', 10);
	document.body.style.top = 'auto';
	document.body.classList.remove('disable-scroll');
	window.scroll({ top: pagePosition, left: 0 });
	document.body.removeAttribute('data-position');
}

function clickOutside(event: MouseEvent, element: HTMLElement): boolean {
	const $target: HTMLElement = event.target as HTMLElement;
	return !element?.contains($target);
}

function hasDestroy(component: { destroy?(): void }) {
	if (component && typeof component.destroy === 'function') return true;
}

export { classInstance, priceFormatter, getCityByCoords, disableScroll, enableScroll, clickOutside, hasDestroy };
