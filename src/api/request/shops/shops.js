// TODO: временная заглушка
export default async function SHOPS() {
	return fetch('/data/shops.json')
		.then((response) => response.json())
		.then((response) => response)
		.catch((errors) => errors);
}
