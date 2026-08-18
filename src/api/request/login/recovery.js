// TODO: временная заглушка
const email = 'email@mail.ru';

export default async function RECOVERY(data, repeat) {
	const getResut = () => {
		if (email === data.email && !repeat) {
			return {
				status: 'success',
				title: 'Восстановление пароля',
				text: `Мы отправили подробные инструкции по восстановлению пароля на почту <b>${data.email}</b>`,
			};
		} else if (email === data.email && repeat) {
			return {
				status: 'warning',
				title: 'Восстановление пароля',
				text: `Мы <b>повторно</b> отправили подробные инструкции по восстановлению пароля на почту <b>${data.email}</b>`,
			};
		} else {
			return {
				status: 'error',
				title: 'Восстановление пароля',
				text: `Пользователь с email: <b>${data.email}</b>, не найден`,
			};
		}
	};

	return new Promise((resolve) => {
		setTimeout(() => resolve(getResut()), 500);
	});
}
