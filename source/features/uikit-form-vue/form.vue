<template>
	<form ref="form" novalidate @submit.prevent="submitHendler">
		<form-input v-model="formData['name']" v-bind="formShema['name']" />
		<form-input v-model="formData['email']" v-bind="formShema['email']" />
		<form-input v-model="formData['tel']" v-bind="formShema['tel']" />
		<form-select v-model="formData['category']" v-bind="formShema['category']" />
		<form-select v-model="formData['skills']" v-bind="formShema['skills']" />
		<form-complete
			v-model="formData['city']"
			v-bind="formShema['city']"
			@change="updateResultCity"
			@complete="updateLocation"
		/>
		<form-complete
			v-show="location.complete"
			v-model="formData['address']"
			v-bind="formShema['address']"
			@change="updateResultAddress"
		/>
		<form-textarea v-model="formData['comment']" v-bind="formShema['comment']" />
		<form-file v-bind="formShema['file']" />
		<form-checkbox v-model="formData['confirm']" v-bind="formShema['confirm']" />
		<button class="button button--primary" type="submit" :disabled="formLooked">Submit</button>
	</form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getDadataCity, getDadataAddress } from '@/api/services/dadata';

import { renderDemo } from '../uikit-render/render';

import FormMixin from '@/shared/form/form.vue';
import FormFile from '@/shared/form/form-element/form-file/form-file.vue';
import FormInput from '@/shared/form/form-element/form-input/form-input.vue';
import FormSelect from '@/shared/form/form-element/form-select/form-select.vue';
import FormComplete from '@/shared/form/form-element/form-complete/form-complete.vue';
import FormTextarea from '@/shared/form/form-element/form-textarea/form-textarea.vue';
import FormCheckbox from '@/shared/form/form-element/form-checkbox/form-checkbox.vue';

export default defineComponent({
	name: 'FormApp',
	components: {
		FormFile,
		FormInput,
		FormSelect,
		FormComplete,
		FormTextarea,
		FormCheckbox,
	},
	mixins: [FormMixin],
	data() {
		return {
			location: {
				region: '',
				city: '',
				settlement: '',
				complete: false,
			},
			formData: {
				name: '',
				email: '',
				tel: '',
				category: '',
				skills: '',
				city: '',
				address: '',
				comment: '',
				confirm: false,
			},
			formShema: {
				name: {
					id: 'vue-name',
					name: 'name',
					label: 'Name',
					placeholder: 'Name',
					autocomplete: 'given-name',
					message: 'text',
					required: true,
					rule: 'text',
				},
				email: {
					id: 'vue-email',
					type: 'email',
					name: 'email',
					label: 'Email',
					placeholder: 'user@mail.com',
					autocomplete: 'email',
					message: 'email',
					required: true,
					rule: 'email',
				},
				tel: {
					id: 'vue-tel',
					type: 'tel',
					name: 'tel',
					label: 'Phone',
					placeholder: '+7 (999) 999-99-99',
					autocomplete: 'tel',
					message: 'tel',
					required: true,
					rule: 'tel',
					mask: 'tel',
				},
				category: {
					id: 'vue-category',
					name: 'category',
					label: 'Category',
					placeholder: 'Choose Category',
					message: 'select',
					required: true,
					options: [
						{
							value: 'Medical practice',
							text: 'Medical practice',
						},
						{
							value: 'rganization management',
							text: 'Organization management',
						},
						{
							value: 'Supervision and care activities',
							text: 'Supervision and care activities',
						},
						{
							value: 'Psychological counseling',
							text: 'Psychological counseling',
						},
						{
							value: 'Artistic activity',
							text: 'Artistic activity',
						},
						{
							value: 'Computer software development',
							text: 'Computer software development',
						},
						{
							value: 'Information protection',
							text: 'Information protection',
						},
						{
							value: 'Accounting activities',
							text: 'Accounting activities',
						},
					],
				},
				skills: {
					id: 'vue-skills',
					name: 'skills',
					label: 'Skills',
					placeholder: 'Choose Skills',
					message: 'select',
					required: true,
					multiple: true,
					options: [
						{
							value: 'JavaScript',
							text: 'JavaScript',
						},
						{
							value: 'HTML5',
							text: 'HTML5',
						},
						{
							value: 'CSS3',
							text: 'CSS3',
						},
						{
							value: 'Git',
							text: 'Git',
						},
						{
							value: 'TypeScript',
							text: 'TypeScript',
						},
						{
							value: 'Vue',
							text: 'Vue',
						},
						{
							value: 'Vuex',
							text: 'Vuex',
						},
						{
							value: 'Nuxt',
							text: 'Nuxt',
						},
					],
				},
				city: {
					id: 'vue-city',
					name: 'city',
					label: 'City',
					placeholder: 'Input City',
					autocomplete: 'off',
					message: 'city',
					required: true,
					options: [],
				},
				address: {
					id: 'vue-address',
					name: 'address',
					label: 'Address',
					placeholder: 'Input Address',
					autocomplete: 'off',
					message: 'address',
					required: true,
					options: [],
				},
				comment: {
					id: 'vue-comment',
					name: 'comment',
					label: 'Comment',
					placeholder: 'Some text',
				},
				file: {
					id: 'vue-file',
					name: 'file',
					label: 'Photo',
					message: 'file',
					required: true,
				},
				confirm: {
					id: 'vue-confirm',
					name: 'confirm',
					label: 'I Agree to Privacy Policy',
					required: true,
					look: true,
				},
			},
		};
	},
	methods: {
		submitHendler(event: MouseEvent): void {
			if (!this.formCheck()) return;

			const formData = new FormData(event.target as HTMLFormElement);

			renderDemo(formData);
		},
		updateLocation(data: { value: string; selected: Option | undefined }) {
			const option = data.selected;
			if (!option) return;
			this.location.region = option.region;
			this.location.city = option.city;
			this.location.settlement = option.settlement;
			this.location.complete = option.complete;
			this.updateResultAddress(this.location.city);
		},
		updateResultCity(data: { value: string; selected: Option | undefined }): void {
			this.location.complete = !!data.selected;
			this.formData.address = '';
			getDadataCity(data.value).then((response: Array<object>) => {
				const filtred = response.filter((response: any) => response.data.fias_level !== '65');
				this.formShema.city.options = filtred.map((location: any) => {
					return {
						value: location.value,
						text: location.value,
						complete: location.data.city || location.data.settlement ? true : false,
						region: location.data.region,
						city: location.data.city,
						settlement: location.data.settlement,
					};
				});
			});
		},
		updateResultAddress(data: { value: string; selected: Option | undefined }): void {
			getDadataAddress(data.value, this.location).then((response: Array<object>) => {
				this.formShema.address.options = response.map((location: any) => {
					return {
						value: location.value,
						text: location.value,
						complete: !!location.data.house,
					};
				});
			});
		},
	},
});
</script>
