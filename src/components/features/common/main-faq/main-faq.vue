<template>
	<div class="main-faq collapse">
		<div v-for="item in collapseData" :key="item.id" :class="['main-faq__element collapse__element', { active: item.expanded }]">
			<h3>
				<button
					class="main-faq__button collapse__button"
					role="button"
					:aria-expanded="item.expanded"
					:aria-controls="item.id"
					@click="item.expanded = !item.expanded"
				>
					<span>{{ item.name }}</span>
					<i class="collapse__icon icon icon-chevron-down"></i>
				</button>
			</h3>
			<div :id="item.id" class="collapse__content">
				<div class="main-faq__content">{{ item.text }}</div>
			</div>
		</div>
		<button
			v-show="lengthCurrent < lengthMax"
			:class="['main-faq__more button button--secondary', { loading: loading }]"
			type="button"
			@click="loadHandler"
		>
			<span>Показать еще</span>
		</button>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { FAQ } from '@/api/request';

interface CollapseData {
	id: string;
	name: string;
	text: string;
	expanded: boolean;
}

const collapseData = ref<CollapseData[]>([]);
const loading = ref(false);

const lengthCurrent = ref(0);
const lengthMax = ref(0);
const quantity = 4;

const sendReqest = () => {
	loading.value = true;
	FAQ(lengthCurrent.value, quantity)
		.then((response) => {
			lengthMax.value = response.length;
			lengthCurrent.value = lengthCurrent.value + quantity;
			collapseData.value.push(...response.data.map((item: CollapseData) => ({ ...item, expanded: false })));
		})
		.catch((error) => {
			window.app.notify?.append({
				type: 'error',
				delay: 10000,
				title: 'Ошибка',
				text: error instanceof Error ? error.message : String(error),
			});
		})
		.finally(() => {
			loading.value = false;
		});
};

const loadHandler = () => {
	sendReqest();
};

onMounted(() => {
	sendReqest();
});
</script>
