// TODO: временная заглушка
const emailArray = [];

export default async function SUBSCRIBE(data) {
	const email = data.get('email');

	const getResut = (value) => {
		const result = {};
		if (!emailArray.includes(value)) {
			result.status = 'success';
			result.title = 'Подписка оформлена';
			result.text = `Оформлена подписка на рассылку для почты <b>${value}</b>`;
		} else {
			result.status = 'warning';
			result.title = 'Предупреждение';
			result.text = `Подписка на рассылку для почты <b>${value}</b>,<br>уже была оформлена`;
		}
		emailArray.push(email);
		return result;
	};

	return new Promise((resolve) => {
		setTimeout(() => resolve(getResut(email)), 500);
	});
}
