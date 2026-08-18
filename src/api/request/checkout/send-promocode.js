// TODO: временная заглушка
export default async function SEND_PROMOCODE(data) {
	const getResut = (value) => {
		if (value === '0000') {
			return {
				id: `promo-${Math.random().toString(36).substring(2, 11)}`,
				value: value,
				status: 'success',
				message: 'Применен',
				sale: 2000,
			};
		} else if (value === '1111') {
			return {
				id: `promo-${Math.random().toString(36).substring(2, 11)}`,
				value: value,
				status: 'success',
				message: 'Применен',
				sale: 5000,
			};
		} else {
			return {
				id: `promo-${Math.random().toString(36).substring(2, 11)}`,
				value: value,
				status: 'error',
				message: 'Не найден',
				sale: 0,
			};
		}
	};

	return new Promise((resolve) => {
		setTimeout(() => resolve(getResut(data)), 500);
	});
}
