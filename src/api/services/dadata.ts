import type { DaDataResponse, DaDataAddress } from '@/api/services/dadata.types';

const dadata = {
	url: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		Authorization: `Token ${import.meta.env.VITE_DADATA_TOKEN}`,
	},
};

export async function GET_ADDRESS(query: string) {
	return fetch(dadata.url, {
		method: 'POST',
		mode: 'cors',
		headers: dadata.headers,
		body: JSON.stringify({
			query: query,
			from_bound: { value: 'region' },
			to_bound: { value: 'house' },
			restrict_value: true,
		}),
	})
		.then((response) => response.json())
		.then((response: DaDataResponse<DaDataAddress>) => response.suggestions)
		.catch((errors) => errors);
}

export async function GET_CITIES(query: string) {
	return fetch(dadata.url, {
		method: 'POST',
		mode: 'cors',
		headers: dadata.headers,
		body: JSON.stringify({
			query: query,
			from_bound: { value: 'city' },
			to_bound: { value: 'settlement' },
			restrict_value: true,
		}),
	})
		.then((response) => response.json())
		.then((response: DaDataResponse<DaDataAddress>) => response.suggestions)
		.catch((errors) => errors);
}
