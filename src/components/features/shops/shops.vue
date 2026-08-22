<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<div class="shops">
		<div class="shops__map">
			<yandex-map
				v-model="map"
				class="shops_ymap"
				:settings="{
					location: {
						center: [37.617644, 55.755819],
						zoom: 10,
					},
					behaviors: ['drag', 'pinchZoom', 'dblClick'],
				}"
				width="100%"
				height="500px"
			>
				<yandex-map-default-scheme-layer />
				<yandex-map-default-features-layer />
				<yandex-map-controls :settings="{ position: 'top left' }">
					<yandex-map-zoom-control />
				</yandex-map-controls>
				<template v-for="shop in shopsData" :key="shop.id">
					<yandex-map-marker
						:settings="{ coordinates: shop.coords, zIndex: activeId === shop.id ? 1 : 0 }"
						position="top-center left-center"
					>
						<button
							:class="['shops-marker', { active: shop.id === activeId }]"
							type="button"
							aria-label="Открыть popup"
							@click="activeHandler(shop.id, shop.coords)"
						>
							<img src="/images/placemark.svg" :alt="shop.name" />
						</button>
					</yandex-map-marker>
				</template>
			</yandex-map>
			<div v-if="activeShop" :class="['shops-popup', { active: isPopupOpen }]">
				<button class="shops-popup__close" aria-label="Закрыть popup" @click="closeHandler">
					<i class="icon icon-close" aria-hidden="true"></i>
				</button>
				<div class="shops-popup__name">{{ activeShop.name }}</div>
				<address class="shops-popup__address">
					<span>{{ activeShop.address }}</span>
					<span>{{ activeShop.metro }}</span>
				</address>
				<div class="shops-popup__box">
					<div class="shops-popup__title"><i class="icon icon-calendar"></i>РЕЖИМ РАБОТЫ</div>
					<ul class="shops-popup__list">
						<li v-for="time in activeShop.time" :key="time">
							<time>{{ time }}</time>
						</li>
					</ul>
				</div>
				<div class="shops-popup__box">
					<div class="shops-popup__title"><i class="icon icon-call"></i>ТЕЛЕФОН</div>
					<a :href="`${getPhoneHref(activeShop.phone)}`" class="link">{{ activeShop.phone }}</a>
				</div>
				<div class="shops-popup__box">
					<div class="shops-popup__title"><i class="icon icon-send"></i>E-MAIL</div>
					<a :href="`mailto:${activeShop.email}`" class="link">{{ activeShop.email }}</a>
				</div>
			</div>
		</div>
		<ul class="shops__list">
			<li
				v-for="shop in shopsData"
				:id="shop.id"
				:key="shop.id"
				:class="['shops-item', { active: shop.id === activeId }]"
				@click="activeHandler(shop.id, shop.coords)"
			>
				<div class="shops-item__content">
					<p class="shops-item__name">{{ shop.name }}</p>
					<address class="shops-item__address">{{ shop.address }}</address>
					<a class="shops-item__phone link" :href="getPhoneHref(shop.phone)">
						{{ shop.phone }}
					</a>
				</div>
			</li>
		</ul>
	</div>
</template>

<script lang="ts" setup>
import { ref, shallowRef, computed, nextTick, onMounted } from 'vue';
import type { LngLat, YMap } from '@yandex/ymaps3-types';
import {
	YandexMap,
	YandexMapDefaultSchemeLayer,
	YandexMapDefaultFeaturesLayer,
	YandexMapControls,
	YandexMapZoomControl,
	YandexMapMarker,
} from 'vue-yandex-maps';

import { SHOPS } from '@/api/request';

interface ShopsData {
	id: string;
	name: string;
	address: string;
	metro: string;
	phone: string;
	email: string;
	time: string[];
	coords: LngLat;
}

const map = shallowRef<YMap | null>(null);
const shopsData = shallowRef<ShopsData[]>([]);

const activeId = ref('');
const isPopupOpen = ref(false);
const activeShop = computed((): ShopsData | undefined => {
	return shopsData.value.find((shop) => shop.id === activeId.value);
});

const getPhoneHref = (phone: string): string => {
	return `tel:${phone.replace(/[-() +]/g, '')}`;
};

const closeHandler = () => {
	isPopupOpen.value = false;
};

const activeHandler = (id: string, coords: LngLat = [0, 0]) => {
	activeId.value = id;
	isPopupOpen.value = true;

	if (map.value && id) {
		map.value.setLocation({
			center: coords,
			duration: 500,
		});
	}

	nextTick(() => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
			});
		}
	});
};

onMounted(() => {
	SHOPS()
		.then((response: ShopsData[]) => {
			shopsData.value = response;
		})
		.catch((error) => {
			window.app.notify?.append({
				type: 'error',
				delay: 10000,
				title: 'Ошибка',
				text: error instanceof Error ? error.message : String(error),
			});
		});
});
</script>
