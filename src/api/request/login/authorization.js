// TODO: временная заглушка
const email = 'email@mail.ru';
const tel = '+7 (999) 999-99-99';
const password = '123456';

export default async function AUTHORIZATION(data, type, repeat) {
	const getResut = () => {
		if (type === 'email') {
			if (email !== data.email) {
				return {
					status: 'error',
					title: 'Вход в личный кабинет',
					text: `Пользователь с email: <b>${data.email}</b>, <br/>не найден`,
				};
			} else if (password !== data.password) {
				return {
					status: 'error',
					title: 'Вход в личный кабинет',
					text: 'Введен не верный пароль',
				};
			} else {
				return {
					status: 'success',
				};
			}
		}
		if (type === 'tel') {
			if (tel !== data.tel) {
				return {
					status: 'error',
					title: 'Вход в личный кабинет',
					text: `Пользователь с tel: <b>${data.tel}</b>, <br/>не найден`,
				};
			} else if (repeat) {
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
		}
	};

	return new Promise((resolve) => {
		setTimeout(() => resolve(getResut()), 500);
	});
}
