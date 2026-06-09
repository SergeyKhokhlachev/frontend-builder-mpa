export function renderDemo(data) {
	let fragment = '';
	for (const [name, value] of data) {
		fragment += `
			<div class="uikit-render__item">
				<div class="uikit-render__name">${name} :</div>
				<div class="uikit-render__value">${value}</div>
			</div>
		`;
	}

	const content = `
		<div class="uikit-render">
			<h2>Send Form Data</h2>
			<div class="uikit-render__list">${fragment}</div>
		</div>
	`;

	app.modal.content('#modal-render', content);
	app.modal.open('#modal-render');
}
