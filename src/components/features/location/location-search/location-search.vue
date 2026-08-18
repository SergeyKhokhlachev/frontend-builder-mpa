<template>
	<div class="location-search">
		<div class="location-search__field">
			<input v-model="searchValue" type="text" name="location" autocomplete="off" placeholder="Введите город" />
		</div>
		<ul class="location-search__list">
			<template v-if="searchValue">
				<li v-for="item in computedList" :key="item.id" class="location-search__item">
					<label>
						<input
							class="visually-hidden"
							type="radio"
							name="city"
							:value="item.value"
							:checked="item.value === curentCity"
							@change="changeHandler"
						/>
						<span class="location-search__name">{{ item.label }}</span>
					</label>
				</li>
			</template>
			<template v-else>
				<li v-for="item in defaultList" :key="item.id" class="location-search__item">
					<label>
						<input
							class="visually-hidden"
							type="radio"
							name="city"
							:value="item.value"
							:checked="item.value === curentCity"
							@change="changeHandler"
						/>
						<span class="location-search__name">{{ item.label }}</span>
					</label>
				</li>
			</template>
			<li v-if="!computedList.length && searchValue !== ''">
				<span class="location-search__name location-search__name--disabled">Города по запросу не найдены</span>
			</li>
		</ul>
	</div>
</template>
<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import { debounce } from 'throttle-debounce-ts';

import { GET_CITIES } from '@/api/services/dadata';
import type { DaDataSuggestion, DaDataAddress } from '@/api/services/dadata.types';

interface Location {
	id: string;
	value: string | null;
	label: string;
}

let curentCity = ref('');

const searchValue = ref('');
const computedList = ref<Location[]>([]);

const defaultList: Location[] = [
	{ id: 'location-city-default-1', value: 'Москва', label: 'Москва' },
	{ id: 'location-city-default-2', value: 'Санкт-Петербург', label: 'Санкт-Петербург' },
	{ id: 'location-city-default-3', value: 'Новосибирск', label: 'Новосибирск' },
	{ id: 'location-city-default-4', value: 'Екатеринбург', label: 'Екатеринбург' },
	{ id: 'location-city-default-5', value: 'Казань', label: 'Казань' },
	{ id: 'location-city-default-6', value: 'Красноярск', label: 'Красноярск' },
	{ id: 'location-city-default-7', value: 'Нижний Новгород', label: 'Нижний Новгород' },
	{ id: 'location-city-default-8', value: 'Челябинск', label: 'Челябинск' },
	{ id: 'location-city-default-9', value: 'Уфа', label: 'Уфа' },
	{ id: 'location-city-default-10', value: 'Самара', label: 'Самара' },
];

const changeHandler = (event: Event) => {
	const target = event.target as HTMLInputElement;
	document.dispatchEvent(
		new CustomEvent('locationChange', {
			bubbles: true,
			cancelable: true,
			detail: {
				location: target.value,
			},
		}),
	);
	window.app.modal?.close();
};

const debouncedFetch = debounce(200, (query: string) => {
	GET_CITIES(query)
		.then((response: DaDataSuggestion<DaDataAddress>[]) => {
			const filtredResponse = response.filter((element) => element.data.city);
			computedList.value = filtredResponse.map((element, index: number) => {
				return {
					id: `location-city-search-${index}`,
					value: element.data.settlement || element.data.city,
					label: element.value,
				};
			});
		})
		.catch((error) => {
			console.warn(error);
		});
});

watch(searchValue, (newValue) => {
	if (!newValue) {
		debouncedFetch.cancel();
	} else {
		debouncedFetch(newValue);
	}
});

onMounted(() => {
	const $location = document.querySelector('.js-location-value');
	curentCity.value = $location ? $location.textContent : '';
});
</script>
