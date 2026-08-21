// TODO: временная заглушка
export default async function REVIEWS(data) {
	const getResut = (data) => {
		console.info(data);
		return {
			status: 'success',
			title: 'Ваш отзыв отправлен',
			text: 'После модерации ваш отзыв будет опубликован',
		};
	};

	return new Promise((resolve) => {
		setTimeout(() => resolve(getResut(data)), 500);
	});
}
