import { GooglePlaceDetailsT } from '../types';
import { PlaceDetailsStrategy, StrategyConfig } from './placeDetailsStrategy';

export class NativePlaceDetails implements PlaceDetailsStrategy {
  private apiKey: string;
  private config: StrategyConfig;

  constructor(apiKey: string, config?: StrategyConfig) {
    this.apiKey = apiKey;
    this.config = config || {};
  }

  fetchPlaceDetails = async (placeId: string): Promise<GooglePlaceDetailsT> => {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?fields=geometry,formatted_address&key=${this.apiKey}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Places Details Error:', errorData);
      throw new Error(
        `Failed to fetch place details: ${
          errorData.error_message || response.statusText
        }`
      );
    }

    const data = await response.json();
    return data.result;
  };
}
