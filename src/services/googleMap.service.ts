import { GooglePlaceDetailsT, GooglePlacePredictionT } from '../types';

class GoogleMapService {
  private API_KEY: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("GoogleMapService: API Key must be provided.");
    }
    this.API_KEY = apiKey;
  }

  fetchPredictions = async (
    input: string,
  ): Promise<GooglePlacePredictionT[]> => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input,
      )}&language=en&key=${this.API_KEY}`,
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
      `https.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,formatted_address&key=${this.API_KEY}`,
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

export { GoogleMapService };