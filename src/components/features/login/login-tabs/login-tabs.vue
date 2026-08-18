<template>
	<div class="login__control tabs__control" role="tablist">
		<button
			v-for="tab in tabs"
			:id="tab.id"
			:key="tab.value"
			ref="tabRefs"
			:class="['login__tab tabs__button', { active: modelValue === tab.value }]"
			type="button"
			role="tab"
			:aria-selected="modelValue === tab.value"
			:aria-controls="tab.panelId"
			:tabindex="modelValue === tab.value ? 0 : -1"
			@click="setActive(tab.value)"
			@keydown="handleKeydown($event, tab.value)"
		>
			{{ tab.label }}
		</button>
	</div>
</template>

<script lang="ts" setup>
import { ref, nextTick, watch } from 'vue';
import type { Tab, TabItem } from '@/components/features/login/login.types';

const props = defineProps<{
	tabs: TabItem[];
	modelValue: Tab; // activeTab
}>();

const emit = defineEmits<{
	'update:modelValue': [value: string];
}>();

const tabRefs = ref<(HTMLButtonElement | null)[]>([]);

const setActive = (tab: string) => {
	emit('update:modelValue', tab);
};

const handleKeydown = (event: KeyboardEvent, currentTab: string) => {
	const currentIndex = props.tabs.findIndex((t) => t.value === currentTab);
	if (currentIndex === -1) return;

	let targetIndex: number;

	switch (event.key) {
		case 'ArrowRight':
		case 'ArrowDown':
			targetIndex = (currentIndex + 1) % props.tabs.length;
			break;
		case 'ArrowLeft':
		case 'ArrowUp':
			targetIndex = (currentIndex - 1 + props.tabs.length) % props.tabs.length;
			break;
		case 'Home':
			targetIndex = 0;
			break;
		case 'End':
			targetIndex = props.tabs.length - 1;
			break;
		default:
			return;
	}

	event.preventDefault();
	const nextTab = props.tabs[targetIndex].value;
	setActive(nextTab);

	nextTick(() => {
		const targetButton = tabRefs.value[targetIndex];
		targetButton?.focus();
	});
};

watch(
	() => props.modelValue,
	(active) => {
		const index = props.tabs.findIndex((t) => t.value === active);
		if (index !== -1) {
			nextTick(() => {
				const btn = tabRefs.value[index];
				btn?.focus();
			});
		}
	},
	{ immediate: true },
);
</script>
