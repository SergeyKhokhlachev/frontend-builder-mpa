<template>
	<div class="checkout-promocode">
		<form class="checkout-promocode__field" novalidate @submit.prevent="submitHandler">
			<input
				v-model="value"
				class="checkout-promocode__input"
				type="text"
				name="promocode"
				placeholder="Есть промокод?"
				:disabled="loading"
			/>
			<button
				:class="['checkout-promocode__apply', { loading: loading }]"
				:disabled="value.length < 4"
				type="submit"
				aria-label="Применить промокод"
			>
				<i class="icon icon-arrow-right"></i>
			</button>
		</form>
		<div class="checkout-promocode__list">
			<div v-for="promocode in promocodes" :key="promocode.id" :class="['checkout-promocode__result', promocode.status]">
				<div class="checkout-promocode__code">
					<i class="icon icon-promocode"></i>
					<span>{{ promocode.value }}</span>
				</div>
				<div class="checkout-promocode__status">
					<span>{{ promocode.message }}</span>
					<button
						class="checkout-promocode__remove"
						type="button"
						aria-label="Уалить промокод"
						@click="emit('remove', promocode.id)"
					>
						<i class="icon icon-close"></i>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { Promocode } from '@/components/features/checkout/checkout.types';

withDefaults(
	defineProps<{
		promocodes: Promocode[];
		loading: boolean;
	}>(),
	{},
);

const value = ref('');

const emit = defineEmits<{
	submit: [value: string];
	remove: [id: string];
}>();

const submitHandler = () => {
	if (value.value.length >= 4) emit('submit', value.value);
};
</script>
