// TODO: временная заглушка
const telArray = [];

export default async function CALLBACK(data) {
	const tel = data.get('tel');

	const getResut = (value) => {
		const result = {};
		if (!telArray.includes(value)) {
			result.status = 'success';
			result.title = 'Ваша заявка принята';
			result.text = 'Наш менеджер свяжется с вами в ближайшее время';
		} else {
			result.status = 'warning';
			result.title = 'Предупреждение';
			result.text = `Заказ звонка на номер <b>${value}</b>,<br>уже была оформлена`;
		}
		telArray.push(tel);
		return result;
	};

	return new Promise((resolve) => {
		setTimeout(() => resolve(getResut(tel)), 500);
	});
}
