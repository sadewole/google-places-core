import { GooglePlacesService } from '../core/googlePlacesService';
import { GooglePlaceDetailsT, GooglePlacePredictionT } from '../types';

// Here, we can use the HTTP API for the native implementation
class GooglePlacesNativeService implements GooglePlacesService {
  private API_KEY: string;
  private countryRestrictions: string[] | undefined;

  constructor(apiKey: string, countryRestrictions?: string[]) {
    if (!apiKey) throw new Error('GoogleMapService: API Key must be provided.');

    this.API_KEY = apiKey;
    this.countryRestrictions = countryRestrictions;
  }

  fetchPredictions = async (
    input: string,
  ): Promise<GooglePlacePredictionT[]> => {
    const response = await fetch(
  `https://places.googleapis.com/v1/places:autocomplete`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': this.API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location'
    },
    body: JSON.stringify({
      input,
      languageCode: 'en',
      ...(this.countryRestrictions && this.countryRestrictions.length > 0 && {
        regionRestriction: {
          countries: this.countryRestrictions
        }
      }),
      locationBias: {
        circle: {
          center: {
            latitude: 9.0820, // Nigeria (Abuja)
            longitude: 8.6753
          },
          radius: 1000000.0 // 1000km radius to cover most of Nigeria
        }
      }
    })
  }
);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Places Autocomplete Error:', errorData);
      throw new Error(`Failed to fetch predictions: ${errorData.error_message || response.statusText}`);
    }

    const data = await response.json();
    return data.predictions || [];
  };

  fetchPlaceDetails = async (placeId: string): Promise<GooglePlaceDetailsT> => {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?fields=geometry,formatted_address&key=${this.API_KEY}`,
    );

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Google Places Details Error:', errorData);
        throw new Error(`Failed to fetch place details: ${errorData.error_message || response.statusText}`);
    }

    const data = await response.json();
    return data.result;
  };
}

export { GooglePlacesNativeService };