import {
  GooglePlacesServiceT as IGooglePlacesService,
  GooglePlaceDetailsT,
  GooglePlacePredictionT,
} from '../types';
import {
    PlaceDetailsStrategy,
  PlaceDetailsStrategyFactory,
  StrategyConfig,
} from '../services/placeDetailsStrategy';
import { PlatformDetector } from '../utils/platform';

interface GooglePlacesConfig extends StrategyConfig {
  apiKey: string;
  enableLogging?: boolean;
}

export class GooglePlacesService implements IGooglePlacesService {
  private apiKey: string;
  private config: GooglePlacesConfig;
  private placeDetailsStrategy: PlaceDetailsStrategy;
  private enableLogging: boolean;

  constructor(config: GooglePlacesConfig) {
    if (!config.apiKey) {
      throw new Error('API Key must be provided.');
    }

    this.apiKey = config.apiKey;
    this.config = config;
    this.enableLogging = config.enableLogging || false;

    // Create appropriate strategy based on platform
    this.placeDetailsStrategy =
      PlaceDetailsStrategyFactory.createStrategyForEnvironment(this.apiKey, {
        countryRestrictions: config.countryRestrictions,
        locationBias: config.locationBias,
        languageCode: config.languageCode,
      });

    this.log(
      'GooglePlacesService initialized for',
      PlatformDetector.detect(),
      'platform'
    );
  }

  async fetchPredictions(input: string): Promise<GooglePlacePredictionT[]> {
    this.log('Fetching predictions for:', input);

    const response = await fetch(
      'https://places.googleapis.com/v1/places:autocomplete',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask': 'suggestions.placePrediction',
        },
        body: JSON.stringify({
          input,
          languageCode: this.config.languageCode || 'en',
          ...this.getRegionRestriction(),
          locationBias: this.getLocationBias(),
          includedPrimaryTypes: ['establishment', 'geocode'],
        }),
      }
    );

    if (!response.ok) {
      const error = await this.handleApiError(response);
      throw new Error(`Failed to fetch predictions: ${error}`);
    }

    const data = await response.json();
    return this.transformPredictions(data);
  }

  async fetchPlaceDetails(placeId: string): Promise<GooglePlaceDetailsT> {
    this.log('Fetching place details for:', placeId);

    // Delegate to the appropriate strategy
    return this.placeDetailsStrategy.fetchPlaceDetails(placeId);
  }

  // Private helper methods
  private getLocationBias() {
    const defaultBias = {
      circle: {
        center: { latitude: 9.082, longitude: 8.6753 },
        radius: 50000,
      },
    };

    return this.config.locationBias
      ? {
          circle: {
            center: this.config.locationBias.center,
            radius: this.config.locationBias.radius,
          },
        }
      : defaultBias;
  }

  private getRegionRestriction() {
    if (!this.config.countryRestrictions?.length) return {};

    return { includedRegionCodes: this.config.countryRestrictions };
  }

  private async handleApiError(response: Response): Promise<string> {
    try {
      const errorData = await response.json();
      this.log('API Error:', errorData);
      return errorData.error?.message || response.statusText;
    } catch {
      return response.statusText;
    }
  }

  private transformPredictions(data: any): GooglePlacePredictionT[] {
    if (!data.suggestions) {
      this.log('No suggestions found');
      return [];
    }

    return data.suggestions.map((suggestion: any) => {
      const prediction = suggestion.placePrediction;
      return {
        description: prediction.text?.text || '',
        place_id: prediction.placeId || '',
        structured_formatting: {
          main_text: prediction.structuredFormat?.mainText?.text || '',
          secondary_text:
            prediction.structuredFormat?.secondaryText?.text || '',
        },
        types: prediction.types || [],
      };
    });
  }

  private log(...args: any[]): void {
    if (this.enableLogging) {
      console.log('[GooglePlacesService]', ...args);
    }
  }
}
