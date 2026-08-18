// TODO: временная заглушка
const code = '999999';

export default async function SEND_CODE(data) {
	const getResut = () => {
		if (code !== data.code) {
			return {
				status: 'error',
				title: 'Проверка sms кода',
				text: `Вы ввели не верный код`,
			};
		} else {
			return {
				status: 'success',
			};
		}
	};

	return new Promise((resolve) => {
		setTimeout(() => resolve(getResut()), 500);
	});
}
