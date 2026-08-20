import type { YandexGeoFeatures, YandexGeoComponent } from '@/api/services/geocode-yandex.types';

function getCurrentPosition(): Promise<GeolocationPosition> {
	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			return reject(new Error('Geolocation API is not available'));
		}
		navigator.geolocation.getCurrentPosition(resolve, reject);
	});
}

export async function GET_CITIES_BY_GEO(apiKey: string): Promise<string[] | null> {
	try {
		const location = await getCurrentPosition();
		const { longitude: lng, latitude: lat } = location.coords;
		const url = `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${apiKey}&geocode=${lng},${lat}&results=5&kind=locality`;

		const res = await fetch(url);

		if (!res.ok) throw new Error(`Ошибка HTTP: ${res.status}`);

		const data = await res.json();
		const features = data.response?.GeoObjectCollection?.featureMember ?? [];

		if (!features.length) return null;

		const components: Array<YandexGeoComponent[]> = features.map((feature: YandexGeoFeatures) => {
			return feature.GeoObject?.metaDataProperty?.GeocoderMetaData?.Address?.Components;
		});

		const locality = components
			.map((component) => {
				const localityComponent = component.find((c) => c.kind === 'locality');
				return localityComponent?.name;
			})
			.filter((name) => name !== undefined);

		return locality ?? null;
	} catch (error) {
		console.warn('Ошибка при определении города:', error);
		return null;
	}
}
