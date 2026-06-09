<template>
	<div class="shops">
		<div class="section-control">
			<div v-if="options.mode === 'main'" class="section-control__col">
				<h1 class="title-page">Адреса магазинов</h1>
			</div>
			<div v-if="options.mode === 'section'" class="section-control__col">
				<h2 class="title-section">Адреса магазинов</h2>
			</div>
			<div class="section-control__col"></div>
		</div>
		<div class="shops__content">
			<yandex-map
				ref="map"
				class="shops__map"
				ymap-class="shops_ymap"
				v-bind="map"
				@balloonclose="balloonClose()"
			>
				<ymap-marker
					v-for="shop in shops"
					:key="shop.id"
					:marker-id="shop.id"
					:coords="shop.coords"
					:icon="icon"
					:balloon-template="getTemplateBalloon(shop)"
					@balloonopen="balloonOpen(shop.id)"
				></ymap-marker>
			</yandex-map>
			<div class="shops__list">
				<div ref="scrollbar" class="shops__scrollbar">
					<div
						v-for="shop in shops"
						:key="shop.id"
						:class="['shops-item', { active: shop.id === active }]"
						@click="choseShop(shop)"
					>
						<div class="shops-item__content">
							<div class="shops-item__name">{{ shop.name }}</div>
							<div class="shops-item__address">{{ shop.address }}</div>
							<a class="shops-item__phone link" :href="getPhoneHref(shop.phone)">
								{{ shop.phone }}
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { Scrollbar } from '@/shared/common/scrollbar/scrollbar';
import { yandexMap, ymapMarker } from 'vue-yandex-maps';

import shopData from './shops-data.json';
import placemark from '/assets/images/placemark.png';

export default defineComponent({
	name: 'ShopsApp',
	components: {
		yandexMap,
		ymapMarker,
	},
	data() {
		return {
			active: null,
			shops: null,
			options: {
				mode: '',
			},
			map: {
				settings: {
					apiKey: '2ea39fee-531d-4fd4-8f2c-7a6cd768ee7b',
					lang: 'ru_RU',
				},
				coords: [55.63082993704032, 37.5805769159791],
				zoom: '10',
				controls: [],
			},
			icon: {
				layout: 'default#image',
				imageHref: placemark,
				imageSize: [36, 48],
				imageOffset: [-18, -48],
				hideIconOnBalloonOpen: false,
			},
		};
	},
	mounted() {
		// this.getData();
		this.scrollbar = new Scrollbar(this.$refs.scrollbar);
		this.options = this.$attrs.options;
		this.shops = shopData;
	},
	methods: {
		getData() {
			fetch('../source/components/shops/shops.json', {
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
			})
				.then((response) => response.json())
				.then((response) => (this.shops = response.data))
				.catch((error) => console.error(error));
		},
		choseShop(shop) {
			this.active = shop.id;
			this.$refs.map.myMap.balloon.open(shop.coords, this.getTemplateBalloon(shop));
		},
		balloonOpen(id) {
			this.active = id;
		},
		balloonClose() {
			this.active = null;
		},
		getPhoneHref(phone) {
			return `tel:${phone.replace(/[-() +]/g, '')}`;
		},
		getTimeList(time) {
			let result = '';
			time.forEach((time) => {
				result += `
				<li>${time}</li>
			`;
			});
			return result;
		},
		getTemplateBalloon(shop) {
			return `
			<div class="balloon">
				<div class="balloon__title">${shop.name}</div>
				<address class="balloon__address">${shop.address}<br>${shop.metro}</address>
				<div class="balloon-box">
					<div class="balloon-box__title">РЕЖИМ РАБОТЫ</div>
					<ul>
						${this.getTimeList(shop.time)}
					<ul>
				</div>
				<div class="balloon-box">
					<div class="balloon-box__title">ТЕЛЕФОН</div>
					<a href="${this.getPhoneHref(shop.phone)}">${shop.phone}</a>
				</div>
				<div class="balloon-box">
					<div class="balloon-box__title">E-MAIL</div>
					<a href="mailto:${shop.email}">${shop.email}</a>
				</div>
			</div>
		`;
		},
	},
});
</script>
