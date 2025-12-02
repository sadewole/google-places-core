import {
  GooglePlacesManager,
  GooglePlacesManagerState,
} from './core/googlePlacesManager';
import { GooglePlacesService } from './core/googlePlacesService';

export function createGooglePlacesManager(
  apiKey: string,
  options?: {
    debounceTime?: number;
    countryRestrictions?: string[];
    locationBias?: {
      center: { latitude: number; longitude: number };
      radius: number;
    };
    languageCode?: string;
    enableLogging?: boolean;
  }
): GooglePlacesManager {
  const { debounceTime, ...config } = options || {};
  const service = new GooglePlacesService({ ...config, apiKey });

  return new GooglePlacesManager(service, debounceTime);
}

export type { GooglePlaceDetailsT, GooglePlacePredictionT } from './types';

export { GooglePlacesService, GooglePlacesManager, GooglePlacesManagerState };
