// TODO: временная заглушка
const email = 'email@mail.ru';
const tel = '+7 (999) 999-99-99';

export default async function REGISTRATION(data, type, repeat) {
	const getResut = () => {
		if (type === 'email' && email === data.email) {
			return {
				status: 'error',
				title: 'Регистрация',
				text: `Пользователь с email: <b>${data.email}</b>, <br/>уже зарегистрирован`,
			};
		} else if (type === 'tel' && tel === data.tel) {
			return {
				status: 'error',
				title: 'Регистрация',
				text: `Пользователь с tel: <b>${data.tel}</b>, <br/>уже зарегистрирован`,
			};
		} else if (type === 'tel' && tel !== data.tel && repeat) {
			return {
				status: 'warning',
				title: 'Вход в личный кабинет',
				text: `Мы <b>повторно</b> отправили sms код на номер <br/><b>${data.tel}</b>`,
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
