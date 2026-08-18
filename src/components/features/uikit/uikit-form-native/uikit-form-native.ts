import Form from '@/components/shared/form/form';
import type { FormChangeEvent } from '@/components/shared/form/form.types';

import { renderDemo } from '@/components/features/uikit/uikit-render/render';

interface UikitFormNativeInstance {
	$form: HTMLFormElement | null;
	$button: HTMLButtonElement | null;
	form: Form | null;

	init(): void;
	destroy(): void;
	submit(event: Event): void;
	change(event: FormChangeEvent): void;
}

export default function uikitFormNative($form: HTMLFormElement): UikitFormNativeInstance {
	return {
		$form,
		$button: null,
		form: null,

		init() {
			if (!this.$form) return;

			this.form = new Form(this.$form);
			this.$button = this.$form.querySelector<HTMLButtonElement>('button[type="submit"]');

			this.submit = this.submit.bind(this);
			this.change = this.change.bind(this);
			this.$form.addEventListener('submit', this.submit);
			this.$form.addEventListener('formChange', this.change);
		},

		destroy() {
			this.$form?.removeEventListener('submit', this.submit);
			this.$form?.removeEventListener('formChange', this.change);

			this.form?.destroy();
			this.form = null;

			this.$form = null;
			this.$button = null;
		},

		submit(event: Event) {
			event.preventDefault();

			if (!this.form || !this.form.checkForm) return;
			if (!this.form.checkForm(true)) return;

			const target = event.target as HTMLFormElement | null;
			if (target) {
				const formData = new FormData(target);
				renderDemo(formData);
			}
		},

		change(event: FormChangeEvent) {
			if (this.$button) {
				this.$button.disabled = !event.detail?.valid;
			}
		},
	};
}
