// TODO: временная заглушка
export default async function SEARCH(query) {
	return fetch('/data/products.json')
		.then((response) => response.json())
		.then((response) => {
			const filtred = response.filter((element) => element.name.toLowerCase().includes(query.toLowerCase()));
			if (import.meta.env.DEV) {
				return filtred.map((element) => {
					return { ...element, image: `/assets${element.image}` };
				});
			} else {
				return filtred;
			}
		})
		.catch((errors) => errors);
}
