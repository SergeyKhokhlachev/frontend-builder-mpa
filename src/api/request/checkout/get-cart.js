// TODO: временная заглушка
export default async function GET_CART() {
	return fetch('/data/cart.json')
		.then((response) => response.json())
		.then((response) => {
			if (import.meta.env.DEV) {
				return response.map((element) => {
					return { ...element, image: `/assets${element.image}` };
				});
			} else {
				return response;
			}
		})
		.catch((errors) => errors);
}
