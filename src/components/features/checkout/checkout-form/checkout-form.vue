<template>
	<form id="checkout-form" action="/pages/checkout-result.html" class="checkout-form" novalidate @submit.prevent="submitHandler">
		<fieldset class="checkout-form__fieldset">
			<legend class="checkout-form__legend">Данные получателя</legend>
			<div class="checkout-form__field">
				<form-input v-bind="FORM_SCHEMA.name" :ref="(el) => setMainRef('name', el)" v-model="formData.name" />
			</div>
			<div class="checkout-form__field checkout-form__field--half">
				<form-input v-bind="FORM_SCHEMA.email" :ref="(el) => setMainRef('email', el)" v-model="formData.email" />
			</div>
			<div class="checkout-form__field checkout-form__field--half">
				<form-input v-bind="FORM_SCHEMA.tel" :ref="(el) => setMainRef('tel', el)" v-model="formData.tel" />
			</div>
			<div class="checkout-form__field">
				<form-checkbox v-bind="FORM_SCHEMA.accept" :ref="(el) => setMainRef('accept', el)" v-model="formData.accept">
					Я Согласен на обработку и передачу <a href="#" class="link">персональных данных</a>
				</form-checkbox>
			</div>
		</fieldset>
		<fieldset class="checkout-form__fieldset">
			<legend class="checkout-form__legend">Способ доставки</legend>
			<div class="checkout-radio">
				<form-radio v-bind="FORM_SCHEMA.delivery" :ref="(el) => setMainRef('delivery', el)" v-model="formData.delivery">
					<template #label="{ option }">
						<span class="checkout-radio__info">
							<span class="checkout-radio__title">{{ option.label }}</span>
							<span v-if="option.value === 'courier'" class="checkout-radio__text">{{ deliveryData.courier.text }}</span>
							<span v-if="option.value === 'post'" class="checkout-radio__text">{{ deliveryData.post.text }}</span>
							<span v-if="option.value === 'pickup'" class="checkout-radio__text">{{ deliveryData.pickup.text }}</span>
						</span>
						<span v-if="option.value === 'courier'" class="checkout-radio__box">
							<span class="checkout-radio__date">{{ deliveryData.courier.date }}</span>
							<span class="checkout-radio__price">{{ priceFormatter.format(deliveryData.courier.price) }}</span>
						</span>
						<span v-if="option.value === 'post'" class="checkout-radio__box">
							<span class="checkout-radio__date">{{ deliveryData.post.date }}</span>
							<span class="checkout-radio__price">{{ priceFormatter.format(deliveryData.post.price) }}</span>
						</span>
						<span v-if="option.value === 'pickup'" class="checkout-radio__box">
							<span class="checkout-radio__date">{{ deliveryData.pickup.date }}</span>
							<span class="checkout-radio__price">{{ priceFormatter.format(deliveryData.pickup.price) }}</span>
						</span>
					</template>
				</form-radio>
			</div>
		</fieldset>
		<fieldset v-show="formData.delivery === 'courier' || formData.delivery === 'post'" class="checkout-form__fieldset">
			<legend class="checkout-form__legend">Адрес доставки</legend>
			<div class="checkout-form__field checkout-form__field--half">
				<form-complete
					v-bind="FORM_SCHEMA.address"
					:ref="(el) => setAddressRef('address', el)"
					v-model="formData.address"
					:options="addressOptions"
					@complete="completeHanler"
				/>
			</div>
			<div class="checkout-form__field checkout-form__field--quarter">
				<form-input
					v-bind="FORM_SCHEMA.index"
					:ref="
						(el) => {
							setAddressRef('index', el);
							indexFieldRef = el;
						}
					"
					v-model="formData.index"
				/>
			</div>
			<div class="checkout-form__field checkout-form__field--quarter">
				<form-input v-bind="FORM_SCHEMA.apartment" :ref="(el) => setAddressRef('apartment', el)" v-model="formData.apartment" />
			</div>
		</fieldset>
		<fieldset v-show="formData.delivery === 'pickup'" class="checkout-form__fieldset">
			<legend class="checkout-form__legend">Пункт выдачи</legend>
		</fieldset>
		<fieldset class="checkout-form__fieldset">
			<legend class="checkout-form__legend">Способ оплаты</legend>
			<div class="checkout-radio">
				<form-radio v-bind="FORM_SCHEMA.payment" :ref="(el) => setMainRef('payment', el)" v-model="formData.payment">
					<template #label="{ option }">
						<span class="checkout-radio__info">
							<span class="checkout-radio__title">{{ option.label }}</span>
							<span v-if="option.value === 'cardOnline'" class="checkout-radio__text">
								Подтверждением вашей оплаты является электронное почтовое уведомление, пришедшее после оплаты
							</span>
							<span v-if="option.value === 'cashDelivery'" class="checkout-radio__text">
								Подтверждением вашей оплаты является фискальный кассовый чек, вручаемый во время оплаты заказа.
							</span>
							<span v-if="option.value === 'cardDelivery'" class="checkout-radio__text">
								Подтверждением вашей оплаты является фискальный кассовый чек, вручаемый во время оплаты заказа.
							</span>
						</span>
					</template>
				</form-radio>
			</div>
		</fieldset>
	</form>
</template>
<script lang="ts" setup>
import { computed, ref, watch, nextTick, onMounted } from 'vue';
import { debounce } from 'throttle-debounce-ts';
import { priceFormatter } from '@/common/helpers';

import { FormInput, FormComplete, FormCheckbox, FormRadio, useForm } from '@/components/shared/form/form.vue';
import type { FormComponent, FieldSchema, SelectionOption } from '@/components/shared/form/form.types';
import type { FormData } from '@/components/features/checkout/checkout.types';

import { GET_ADDRESS } from '@/api/services/dadata';
import type { DaDataSuggestion, DaDataAddress } from '@/api/services/dadata.types';

const emit = defineEmits<{
	submit: [data: FormData];
	delivery: [data: number];
}>();

const formData = ref<FormData>({
	name: '',
	email: '',
	tel: '',
	accept: false,
	delivery: 'courier',
	address: '',
	apartment: '',
	index: '',
	payment: 'cardOnline',
});

const deliveryData = {
	courier: {
		text: 'До дверей в удобное для вас время',
		date: 'завтра',
		price: 499,
	},
	post: {
		text: 'В ближайшее отделение почты России',
		date: 'c 25.09.2026',
		price: 210,
	},
	pickup: {
		text: 'в 32 пункта выдачи',
		date: 'завтра',
		price: 0,
	},
};

const FORM_SCHEMA: {
	name: FieldSchema<'input'>;
	email: FieldSchema<'input'>;
	tel: FieldSchema<'input'>;
	accept: FieldSchema<'checkbox'>;
	delivery: FieldSchema<'radio'>;
	address: FieldSchema<'complete'>;
	apartment: FieldSchema<'input'>;
	index: FieldSchema<'input'>;
	payment: FieldSchema<'radio'>;
} = {
	name: {
		id: 'checkout-name',
		name: 'name',
		label: 'Ф.И.О.',
		placeholder: 'Введите Ф.И.О.',
		autocomplete: 'name',
		required: true,
	},
	email: {
		id: 'checkout-email',
		name: 'email',
		type: 'email',
		label: 'Email',
		placeholder: 'Введите Email',
		autocomplete: 'email',
		required: true,
	},
	tel: {
		id: 'checkout-tel',
		name: 'tel',
		type: 'tel',
		label: 'Телефон',
		placeholder: '+7(___) ___-__-__',
		autocomplete: 'tel',
		required: true,
	},
	accept: {
		id: 'checkout-accept',
		name: 'accept',
		required: true,
	},
	delivery: {
		id: 'checkout-delivery',
		name: 'delivery',
		options: [
			{ id: 'checkout-courier', value: 'courier', label: 'Курьером' },
			{ id: 'checkout-post', value: 'post', label: 'Почтой России' },
			{ id: 'checkout-pickup', value: 'pickup', label: 'Самовывоз' },
		],
		required: true,
	},
	address: {
		id: 'checkout-address',
		name: 'address',
		label: 'Адрес',
		placeholder: 'Введите Адрес',
		required: true,
	},
	apartment: {
		id: 'checkout-apartment',
		name: 'apartment',
		label: 'Квартира',
		placeholder: 'Введите Номер',
		required: false,
	},
	index: {
		id: 'checkout-index',
		name: 'index',
		label: 'Почтовый индекс',
		placeholder: 'Введите Индекс',
		rule: 'index',
		message: 'index',
		required: true,
	},
	payment: {
		id: 'checkout-payment',
		name: 'payment',
		options: [
			{ id: 'checkout-cardOnline', value: 'cardOnline', label: 'Банковской картой онлайн' },
			{ id: 'checkout-cashDelivery', value: 'cashDelivery', label: 'Наличными при получении' },
			{ id: 'checkout-cardDelivery', value: 'cardDelivery', label: 'Банковской картой при получении' },
		],
		required: true,
	},
};

const deliveryPrice = computed(() => {
	return deliveryData[formData.value.delivery].price;
});

const { setFieldRef: setMainRef, checkForm: checkMain } = useForm();
const { setFieldRef: setAddressRef, checkForm: checkAddress } = useForm();
// const { setFieldRef: setPickupRef , checkForm: checkPickup } = useForm();

const submitHandler = async (event: SubmitEvent) => {
	const target = event.target as HTMLFormElement;

	let isValid = await checkMain(Object.keys(formData.value));
	let errorField = target.querySelector('.form-element.error');

	if (formData.value.delivery === 'courier' || formData.value.delivery === 'post') {
		isValid = await checkAddress(Object.keys(formData.value));
	}

	if (!isValid) {
		if (errorField) errorField.scrollIntoView({ behavior: 'smooth', block: 'start' });
		return;
	}

	emit('submit', formData.value);
};

const indexFieldRef = ref<unknown>(null);

const completeHanler = (option: SelectionOption) => {
	if (option.param) {
		formData.value.index = option.param;
		nextTick(() => {
			const fieldIndex = indexFieldRef.value as FormComponent;
			if (fieldIndex && typeof fieldIndex.validate === 'function') fieldIndex.validate(true);
		});
	}
};

const addressOptions = ref<SelectionOption[]>([]);
const addressValue = computed(() => formData.value.address);

const debouncedFetch = debounce(200, (query: string) => {
	GET_ADDRESS(query)
		.then((response: DaDataSuggestion<DaDataAddress>[]) => {
			const filtredResponse = response.filter((element) => element.data.house);
			addressOptions.value = filtredResponse.map((element, index: number) => {
				return {
					id: `dadata-address-${index}`,
					value: element.unrestricted_value,
					label: element.value,
					param: element.data.postal_code || '',
				};
			});
		})
		.catch((error) => {
			console.warn(error);
		});
});

watch(deliveryPrice, (newValue) => {
	emit('delivery', newValue);
});

watch(addressValue, (newValue) => {
	if (!newValue) {
		debouncedFetch.cancel();
		addressOptions.value = [];
	} else {
		debouncedFetch(newValue);
	}
});

onMounted(() => {
	emit('delivery', deliveryPrice.value);
});
</script>
