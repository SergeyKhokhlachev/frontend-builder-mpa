// TODO: временная заглушка
export default async function FAQ(start, step) {
	return fetch('/data/faq.json')
		.then((response) => response.json())
		.then((response) => {
			return {
				length: response.length,
				data: response.length > start ? response.slice(start, start + step) : response,
			};
		})
		.catch((errors) => errors);
}
