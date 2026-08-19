<template>
	<div class="checkout-card-short">
		<div class="checkout-card-short__body">
			<a class="checkout-card-short__preview" :href="href">
				<picture class="lazy">
					<img :src="image" :alt="name" />
				</picture>
			</a>
			<div class="checkout-card-short__content">
				<span class="checkout-card-short__article">Арт: {{ article }}</span>
				<a class="checkout-card-short__name" :href="href">{{ name }}</a>
			</div>
			<div class="checkout-card-short__price">
				<div class="checkout-card-short__price-new">{{ priceFormatter.format(priceNew) }}</div>
				<div class="checkout-card-short__price-old">{{ priceFormatter.format(priceOld) }}</div>
			</div>
		</div>
		<div class="checkout-card-short__footer">
			<div class="checkout-card-short__counter">
				<button type="button" aria-label="Уменьшить количество" :disabled="added <= 1" @click="emit('change', id, added - 1)">
					<i class="icon icon-op-minus"></i>
				</button>
				<input
					class="checkout-card-short__value"
					type="text"
					name="counter"
					:value="added"
					readonly
					aria-label="Количество товара в корзине"
				/>
				<button
					type="button"
					aria-label="Увеличить количество"
					:disabled="added >= quantity"
					@click="emit('change', id, added + 1)"
				>
					<i class="icon icon-op-plus"></i>
				</button>
			</div>
			<div class="checkout-card-short__control">
				<button
					:class="['favorite', { active: favorite }]"
					type="button"
					:aria-pressed="favorite"
					aria-label="Добавить в избранное"
					@click="emit('favorite', !favorite)"
				>
					<div class="favorite__icons">
						<i class="icon icon-favorite"></i>
						<i class="icon icon-favorite-fill"></i>
					</div>
				</button>
				<button
					class="checkout-card-short__remove"
					type="button"
					aria-label="Удалить товар из корзины"
					@click.stop="emit('remove', id)"
				>
					<i class="icon icon-trash"></i>
				</button>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { priceFormatter } from '@/common/helpers';

withDefaults(
	defineProps<{
		id: string;
		href: string;
		name: string;
		article: string;
		priceNew: number;
		priceOld: number;
		quantity: number;
		added: number;
		favorite: boolean;
		available: boolean;
		image: string;
		color: string;
		size: string;
	}>(),
	{},
);

const emit = defineEmits<{
	remove: [id: string];
	change: [id: string, value: number];
	favorite: [value: boolean];
}>();
</script>
