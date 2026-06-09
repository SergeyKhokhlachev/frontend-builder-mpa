import { renderDemo } from '../uikit-render/render';

export function formDemoCode(selector) {
	if (!selector) return;

	const $form = selector;
	const formInstance = new app.Form($form);

	$form.addEventListener('submit', (event) => {
		event.preventDefault();

		if (!formInstance.formCheck(false)) return;

		const formData = new FormData(event.target);

		renderDemo(formData);
	});
}
