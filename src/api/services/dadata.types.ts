export interface DaDataResponse<T> {
	suggestions: DaDataSuggestion<T>[];
}

export interface DaDataSuggestion<T> {
	value: string;
	unrestricted_value: string;
	data: T;
}

export interface DaDataAddress {
	postal_code: string | null;
	country: string;
	country_iso_code: string;
	federal_district: string | null;

	region_fias_id: string;
	region_with_type: string;
	region_type: string;
	region_type_full: string;
	region: string;

	area_fias_id: string | null;
	area_with_type: string | null;
	area_type: string | null;
	area_type_full: string | null;
	area: string | null;

	city_fias_id: string | null;
	city_with_type: string | null;
	city_type: string | null;
	city_type_full: string | null;
	city: string | null;

	settlement: string | null;
	settlement_fias_id: string | null;
	settlement_kladr_id: string | null;
	settlement_type: string | null;
	settlement_type_full: string | null;
	settlement_with_type: string | null;

	street_fias_id: string | null;
	street_with_type: string | null;
	street_type: string | null;
	street_type_full: string | null;
	street: string | null;

	house_fias_id: string | null;
	house_type: string | null;
	house_type_full: string | null;
	house: string | null;

	block_type: string | null;
	block: string | null;
	flat_type: string | null;
	flat: string | null;

	fias_id: string;
	fias_level: string;
	kladr_id: string;
	capital_marker: string;
	okato: string | null;
	oktmo: string | null;
	tax_office: string | null;

	geo_lat: string | null; // Координаты: Широта
	geo_lon: string | null; // Координаты: Долгота
	qc_geo: '0' | '1' | '2' | '3' | '4' | '5' | null;
}
