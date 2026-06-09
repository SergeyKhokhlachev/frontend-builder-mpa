export function notifyDemo() {
	const btnError = document.querySelector('.js-notify-uikit-danger');
	const btnWarning = document.querySelector('.js-notify-uikit-warning');
	const btnSuccess = document.querySelector('.js-notify-uikit-success');
	const btnDefault = document.querySelector('.js-notify-uikit-default');

	btnError.addEventListener('click', () => {
		app.notify.append({
			id: 'notify-uikit-danger',
			type: 'danger',
			delay: '10000',
			content:
				'<h3>Title Notify</h3><p>Lorem ipsum dolor sit amet consectetur adipisicing elit</p>',
		});
	});

	btnWarning.addEventListener('click', () => {
		app.notify.append({
			id: 'notify-uikit-warning',
			type: 'warning',
			delay: '10000',
			content:
				'<h3>Title Notify</h3><p>Lorem ipsum dolor sit amet consectetur adipisicing elit</p>',
		});
	});

	btnSuccess.addEventListener('click', () => {
		app.notify.append({
			id: 'notify-uikit-success',
			type: 'success',
			delay: '10000',
			content:
				'<h3>Title Notify</h3><p>Lorem ipsum dolor sit amet consectetur adipisicing elit</p>',
		});
	});

	btnDefault.addEventListener('click', () => {
		app.notify.append({
			id: 'notify-uikit-default',
			content:
				'<h3>Title Notify</h3><p>Lorem ipsum dolor sit amet consectetur adipisicing elit</p>',
		});
	});
}
