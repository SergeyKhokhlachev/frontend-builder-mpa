export interface YandexGeoComponent {
	kind: string;
	name: string;
}

export interface YandexGeoFeatures {
	GeoObject?: {
		metaDataProperty?: {
			GeocoderMetaData?: {
				Address?: {
					Components: YandexGeoComponent[];
				};
			};
		};
	};
}
