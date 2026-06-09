type Location = {
	region: string;
	city: string;
	settlement: string;
} & {
	[key: string]: string;
};

const dadata = {
	url: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'Authorization': 'Token 3642a698005491b900bdfc539ac8d321106f4f41',
	},
};

function getDadataCity(query: string): Promise<unknown> {
	return new Promise((resolve, reject) => {
		fetch(dadata.url, {
			method: 'POST',
			mode: 'cors',
			headers: dadata.headers,
			body: JSON.stringify({
				query: query,
				from_bound: { value: 'city' },
				to_bound: { value: 'settlement' },
			}),
		})
			.then((response) => response.json())
			.then((result) => resolve(result.suggestions))
			.catch((error) => reject(error));
	});
}

function getDadataAddress(query: string, location: Location): Promise<unknown> {
	return new Promise((resolve, reject) => {
		fetch(dadata.url, {
			method: 'POST',
			mode: 'cors',
			headers: dadata.headers,
			body: JSON.stringify({
				query: query,
				count: 20,
				locations: [
					{
						region: location.region,
						city: location.city,
						settlement: location.settlement,
					},
				],
				from_bound: { value: 'street' },
				to_bound: { value: 'house' },
			}),
		})
			.then((response) => response.json())
			.then((result) => resolve(result.suggestions))
			.catch((error) => reject(error));
	});
}

export { getDadataCity, getDadataAddress };
