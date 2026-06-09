import { classInstance } from '@/shared/helpers/helpers';

import { getDadataCity, getDadataAddress } from '@/api/services/dadata';

import { renderDemo } from '../uikit-render/render';

function updateResultCity(value, instance) {
	getDadataCity(value).then((response) => {
		const filtred = response.filter((response) => response.data.fias_level !== '65');
		instance.setOptions(
			filtred.map((location) => {
				return {
					value: location.value,
					text: location.value,
					complete: location.data.city || location.data.settlement ? true : false,
					region: location.data.region,
					city: location.data.city,
					settlement: location.data.settlement,
				};
			}),
		);
	});
}

function updateResultAddress(value, location, instance) {
	getDadataAddress(value, location).then((response) => {
		instance.setOptions(
			response.map((location) => {
				return {
					value: location.value,
					text: location.value,
					complete: !!location.data.house,
				};
			}),
		);
	});
}

export function formDemoNative(selector) {
	if (!selector) return;

	const $form = selector;
	const formInstance = new app.Form($form);

	$form.addEventListener('submit', (event) => {
		event.preventDefault();

		if (!formInstance.formCheck(false)) return;

		const formData = new FormData(event.target);

		renderDemo(formData);
	});

	const $city = $form.querySelector('[name="city"]');
	const $address = $form.querySelector('[name="address"]');

	if (!$city || !$address) return;

	const $addressElement = $address.closest('.js-form-element');
	$addressElement.classList.toggle('hidden', true);

	const location = {};
	const cityInstance = classInstance.get($city).formElement;
	const addressInstance = classInstance.get($address).formElement;

	$city.addEventListener('elementComplete', (event) => {
		const option = event.detail.data.selected;
		if (!option) return;
		location.region = option.region;
		location.city = option.city;
		location.settlement = option.settlement;
		location.complete = option.complete;
		updateResultAddress(location.city, location, addressInstance);
	});

	$city.addEventListener('elementChange', (event) => {
		$addressElement.classList.toggle('hidden', !event.detail.data.selected);
		addressInstance.setValue('');
		updateResultCity(event.detail.data.value, cityInstance);
	});

	$address.addEventListener('elementChange', (event) => {
		updateResultAddress(event.detail.data.value, location, addressInstance);
	});
}
