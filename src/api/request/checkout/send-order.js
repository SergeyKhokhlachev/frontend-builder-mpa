// TODO: временная заглушка
export default async function SEND_ORDER(data) {
	console.log(data);
	return new Promise((resolve) => {
		setTimeout(() => resolve(), 500);
	});
}
