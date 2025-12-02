export interface GooglePlacePredictionT {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types: string[];
}

export interface GooglePlaceDetailsT {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport?: {
      south: number;
      west: number;
      north: number;
      east: number;
    };
  };
  formatted_address: string;
  name?: string;
  place_id: string;
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  types?: string[];
}

export interface GooglePlacesServiceT {
  fetchPredictions(input: string): Promise<GooglePlacePredictionT[]>;
  fetchPlaceDetails(placeId: string): Promise<GooglePlaceDetailsT>;
}
