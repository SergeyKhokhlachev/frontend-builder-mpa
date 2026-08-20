<template>
	<div class="location-search">
		<div class="location-search__field">
			<input v-model="searchValue" type="text" name="location" autocomplete="off" placeholder="Введите город" />
		</div>
		<ul class="location-search__list">
			<template v-if="isActive">
				<li v-for="item in resultedList" :key="item.id" class="location-search__item">
					<label>
						<input
							class="visually-hidden"
							type="radio"
							name="city"
							:value="item.value"
							:checked="item.value === curentCity"
							@change="changeHandler"
						/>
						<span :class="['location-search__name', { checked: item.value === curentCity }]">{{ item.value }}</span>
					</label>
				</li>
				<li v-if="!resultedList.length">
					<span class="location-search__name location-search__name--disabled">Города по запросу не найдены</span>
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
						<span :class="['location-search__name', { checked: item.value === curentCity }]">{{ item.value }}</span>
					</label>
				</li>
			</template>
		</ul>
		<button :class="['location-search__button button button--primary', { loading: isLoading }]" type="button" @click="geoHandler">
			<span>Определить автоматически</span>
		</button>
	</div>
</template>
<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import { debounce } from 'throttle-debounce-ts';

import { GET_CITIES_BY_GEO } from '@/api/services/geocode-yandex';
import { GET_CITIES } from '@/api/services/dadata';
import type { DaDataSuggestion, DaDataAddress } from '@/api/services/dadata.types';

interface Location {
	id: string;
	value: string;
}

const API_KEY: string = import.meta.env.VITE_YMAP_API_KEY;

const isActive = ref(false);
const isLoading = ref(false);

const curentCity = ref('');
const searchValue = ref('');
const resultedList = ref<Location[]>([]);

const defaultList: Location[] = [
	{ id: 'location-city-default-1', value: 'Москва' },
	{ id: 'location-city-default-2', value: 'Санкт-Петербург' },
	{ id: 'location-city-default-3', value: 'Новосибирск' },
	{ id: 'location-city-default-4', value: 'Екатеринбург' },
	{ id: 'location-city-default-5', value: 'Казань' },
	{ id: 'location-city-default-6', value: 'Красноярск' },
	{ id: 'location-city-default-7', value: 'Нижний Новгород' },
	{ id: 'location-city-default-8', value: 'Челябинск' },
	{ id: 'location-city-default-9', value: 'Уфа' },
	{ id: 'location-city-default-10', value: 'Самара' },
];

const setResultedList = (resulted: string[]) => {
	const unique = [...new Set(resulted)];
	resultedList.value = unique.map((element, index: number) => {
		return {
			id: `location-city-${index}`,
			value: element,
		};
	});
};

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
	curentCity.value = target.value;
	window.app.modal?.close();
};

const geoHandler = () => {
	isLoading.value = true;
	GET_CITIES_BY_GEO(API_KEY)
		.then((response) => {
			if (response?.length) {
				setResultedList(response);
				searchValue.value = '';
				isActive.value = true;
			}
		})
		.catch((errors) => {
			window.app.notify?.append({
				type: 'error',
				delay: 10000,
				title: 'Ошибка',
				text: errors instanceof Error ? errors.message : String(errors),
			});
		})
		.finally(() => {
			isLoading.value = false;
		});
};

const debouncedFetch = debounce(200, (query: string) => {
	GET_CITIES(query)
		.then((response: DaDataSuggestion<DaDataAddress>[]) => {
			const filtredResponse = response
				.map((element) => {
					return element.data.settlement_with_type || element.data.city;
				})
				.filter((element) => element !== null);

			setResultedList(filtredResponse);
		})
		.catch((errors) => {
			window.app.notify?.append({
				type: 'error',
				delay: 10000,
				title: 'Ошибка',
				text: errors instanceof Error ? errors.message : String(errors),
			});
		});
});

watch(searchValue, (newValue) => {
	if (!newValue) {
		debouncedFetch.cancel();
	} else if (newValue.length > 1) {
		isActive.value = true;
		debouncedFetch(newValue);
	} else {
		isActive.value = false;
	}
});

onMounted(() => {
	const $location = document.querySelector('.js-location-value');
	curentCity.value = $location ? $location.textContent : '';
});
</script>
