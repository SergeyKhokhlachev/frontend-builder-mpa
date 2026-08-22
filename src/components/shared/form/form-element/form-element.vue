<template>
	<div :class="['form-element', { valid: complete }, { error: error }, { disabled: disabled }, { focus: focus ? true : false }]">
		<label :id="id" :for="forId">
			<span v-if="label" class="form-element__label">
				{{ label }}
				<span v-if="required" class="form-element__required" aria-hidden="true">*</span>
			</span>
			<slot></slot>
		</label>
		<div v-if="describe" class="form-element__describe">
			{{ describe }}
		</div>
		<div :id="errorId" class="form-element__message" aria-live="polite" aria-atomic="true">
			{{ message }}
		</div>
	</div>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		id?: string;
		forId?: string;
		errorId?: string;
		message?: string;
		label?: string;
		describe?: string;
		required?: boolean;
		disabled?: boolean;
		complete?: boolean;
		error?: boolean;
		focus?: boolean;
	}>(),
	{},
);
</script>
