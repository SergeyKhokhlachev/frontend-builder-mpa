<script lang="ts">
import { defineComponent } from 'vue';

import { FormObserver } from './composition/observer';
import { useValidate } from './composition/validate';

export default defineComponent({
	name: 'FormMixin',
	data() {
		return {
			formLooked: false,
			formValid: false,
		};
	},
	async mounted() {
		this.formCheck(true);
		this.formObserver = new FormObserver(this.$refs.form);
		this.$refs.form.addEventListener('formChange', this.checkHandler);
	},
	beforeUnmount() {
		this.formObserver.destroy();
		this.$refs.form.removeEventListener('formChange', this.checkHandler);
	},
	methods: {
		formCheck(noRender?: boolean): boolean {
			const result = useValidate(this.$refs.form, noRender);

			this.formLooked = result.looked;
			this.formValid = result.valid;

			return result.valid;
		},

		checkHandler(event: CustomEvent): void {
			this.formLooked = event.detail.looked;
		},
	},
});
</script>
