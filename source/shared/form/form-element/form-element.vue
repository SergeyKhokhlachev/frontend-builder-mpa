<template>
	<div
		:class="[
			'form-element',
			{ valid: valid },
			{ error: error },
			{ required: required },
			{ readonly: readonly },
			{ disabled: disabled },
		]"
	>
		<label v-if="label" :for="id" class="form-element__label">
			{{ label }}
			<span v-if="required" class="form-element__required">*</span>
		</label>
		<div class="form-element__field">
			<slot />
		</div>
		<div v-if="describe" class="form-element__describe">
			{{ describe }}
		</div>
		<div class="form-element__message">
			{{ message }}
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		id: { type: String, default: '' },
		label: { type: String, default: '' },
		message: { type: String, default: '' },
		describe: { type: String, default: '' },
		required: { type: Boolean, default: false },
		readonly: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },
		valid: { type: Boolean, default: false },
		error: { type: Boolean, default: false },
	},
});
</script>
