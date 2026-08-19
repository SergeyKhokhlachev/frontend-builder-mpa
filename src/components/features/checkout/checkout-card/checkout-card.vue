<template>
	<div class="checkout-card">
		<template v-if="available">
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
			<button class="checkout-card__remove" type="button" aria-label="Удалить товар из корзины" @click="emit('remove', id)">
				<i class="icon icon-trash"></i>
			</button>
		</template>
		<div class="checkout-card__body">
			<a class="checkout-card__preview" :href="href">
				<picture class="lazy">
					<img :src="image" :alt="name" />
				</picture>
			</a>
			<div class="checkout-card__content">
				<span class="checkout-card__article">Арт: {{ article }}</span>
				<a class="checkout-card__name" :href="href">{{ name }}</a>
				<div class="checkout-card__box">
					<div class="checkout-card__info">
						Размер: <span>{{ size }}</span>
					</div>
					<div class="checkout-card__info">
						Цвет: <span>{{ color }}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="checkout-card__footer">
			<template v-if="!available">
				<div class="checkout-card__unavailable">
					<span class="checkout-card__message">Этот товар закончился</span>
				</div>
			</template>
			<template v-else>
				<div class="checkout-card__counter">
					<button type="button" aria-label="Уменьшить количество" :disabled="added <= 1" @click="emit('change', id, added - 1)">
						<i class="icon icon-op-minus"></i>
					</button>
					<input
						class="checkout-card__value"
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
				<div class="checkout-card__price">
					<div class="checkout-card__price-new">{{ priceFormatter.format(priceNew) }}</div>
					<div class="checkout-card__price-old">{{ priceFormatter.format(priceOld) }}</div>
				</div>
			</template>
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
